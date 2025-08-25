/**
 * Accessible accordion utilities with optional component grouping and nesting.
 *
 * Features
 * - Multiple triggers per item
 * - Automatic ARIA attributes and id wiring
 * - Keyboard support (Enter/Space)
 * - Height animation via GSAP
 * - Rotates only the arrows inside the item's own triggers
 * - Ensures only one item is open per component (direct children only)
 * - Safe when no arrows are present, or when items are standalone (no component wrapper)
 *
 * Cleanup
 * - All event listeners are removed
 * - GSAP tweens are killed
 * - Inline styles and auto-added attributes/ids are reverted when possible
 */
import gsap from 'gsap';

import type { GlobalModule, PageEnterContext } from '$types/page';

import { DEFAULT_ACCORDION_OPTIONS } from './config';
import type { AccordionItem, InitializeItemOptions } from './types';

type ListenerRecord = { el: Element; type: keyof HTMLElementEventMap; handler: EventListener };

/**
 * Initialize all accordions on the page.
 * - Items wrapped in `data-accordion-component` are grouped (single-open enforced among direct children).
 * - Standalone `data-accordion-item` without a component wrapper are initialized individually.
 */
/**
 * Initialize all accordions within the provided container.
 * Returns a disposer that removes listeners and reverts auto-added attributes.
 */
export const initAccorions: GlobalModule['onEnter'] | GlobalModule['onOnce'] = async (
  context: PageEnterContext
) => {
  const { container } = context;

  const listeners: ListenerRecord[] = [];
  const itemDisposers: Array<() => void> = [];

  const accordionComponents = container.querySelectorAll<AccordionItem>(
    DEFAULT_ACCORDION_OPTIONS.componentSelector
  );

  let autoIdCounter = 0;

  accordionComponents.forEach((component) => {
    const items = getDirectChildItems(component);
    items.forEach((item) => {
      const dispose = initializeItem(
        item,
        {
          autoIdCounterRef: () => ++autoIdCounter,
          enforceSingleOpenWithinComponent: true,
        },
        listeners
      );
      if (dispose) itemDisposers.push(dispose);
    });
  });

  // Initialize standalone items (no component wrapper). They toggle independently.
  const standaloneItems = Array.from(
    container.querySelectorAll(DEFAULT_ACCORDION_OPTIONS.itemSelector)
  ).filter((el) => !el.closest(DEFAULT_ACCORDION_OPTIONS.componentSelector)) as AccordionItem[];

  standaloneItems.forEach((item) => {
    const dispose = initializeItem(
      item,
      {
        autoIdCounterRef: () => ++autoIdCounter,
        enforceSingleOpenWithinComponent: false,
      },
      listeners
    );
    if (dispose) itemDisposers.push(dispose);
  });

  return () => {
    // Remove bound listeners
    for (const { el, type, handler } of listeners) {
      el.removeEventListener(type as string, handler as EventListener);
    }
    // Dispose per-item state and revert attributes
    for (const dispose of itemDisposers) dispose();
  };
};

/** Get direct child accordion items for a component (excludes nested components). */
function getDirectChildItems(componentEl: Element): AccordionItem[] {
  const all = Array.from(
    componentEl.querySelectorAll(DEFAULT_ACCORDION_OPTIONS.itemSelector)
  ) as AccordionItem[];
  return all.filter((el) => el.parentElement === componentEl);
}

/**
 * Initialize a single accordion item.
 * Gracefully no-ops if triggers or content are missing.
 */
function initializeItem(
  item: AccordionItem,
  options: InitializeItemOptions,
  listeners: ListenerRecord[]
) {
  const { autoIdCounterRef, enforceSingleOpenWithinComponent } = options;

  const triggers = Array.from(
    item.querySelectorAll(DEFAULT_ACCORDION_OPTIONS.triggerSelector)
  ).filter((t) => t.closest(DEFAULT_ACCORDION_OPTIONS.itemSelector) === item) as AccordionItem[];
  const content = item.querySelector(
    DEFAULT_ACCORDION_OPTIONS.contentSelector
  ) as HTMLElement | null;

  // Missing required parts → do nothing, but avoid throwing
  if (!triggers.length || !content) return;

  // Ensure content has an id before wiring controls
  if (!content.id) {
    content.id = `accordion-content-${autoIdCounterRef()}`;
    content.setAttribute('data-accordion-generated-id', 'true');
  }
  // Initial ARIA & state setup with auto-id wiring
  triggers.forEach((triggerEl) => {
    if (!triggerEl.id) {
      triggerEl.id = `accordion-trigger-${autoIdCounterRef()}`;
      triggerEl.setAttribute('data-accordion-generated-id', 'true');
    }
    triggerEl.setAttribute('aria-expanded', 'false');
    triggerEl.setAttribute('aria-controls', content.id);
    triggerEl.setAttribute('data-accordion-a11y', 'true');
    // Enhance focusability and semantics when not a native button/link
    const tag = triggerEl.tagName;
    if (tag !== 'BUTTON' && tag !== 'A') {
      if (!triggerEl.hasAttribute('role')) triggerEl.setAttribute('role', 'button');
      if (!triggerEl.hasAttribute('tabindex')) triggerEl.setAttribute('tabindex', '0');
      triggerEl.setAttribute('data-accordion-role-added', 'true');
      triggerEl.setAttribute('data-accordion-tabindex-added', 'true');
    }
  });
  content.setAttribute('role', 'region');
  content.setAttribute('aria-hidden', 'true');
  if (!content.getAttribute('aria-labelledby')) {
    content.setAttribute('aria-labelledby', triggers[0].id);
    content.setAttribute('data-accordion-aria-labelledby-added', 'true');
  }
  content.setAttribute('data-accordion-a11y', 'true');

  if (!item.dataset.state) {
    item.dataset.state = 'closed';
  }

  // Click and keyboard handlers
  const handleToggle = (clickedItem: AccordionItem) => {
    if (enforceSingleOpenWithinComponent) {
      const parentComponent = clickedItem.closest(
        DEFAULT_ACCORDION_OPTIONS.componentSelector
      ) as AccordionItem | null;
      if (parentComponent) {
        const siblings = getDirectChildItems(parentComponent);
        const activeSibling = siblings.find(
          (sib) => sib !== clickedItem && sib.dataset.state === 'open'
        );
        if (activeSibling) closeAccordion(activeSibling);
      }
    }
    if (clickedItem.dataset.state === 'open') closeAccordion(clickedItem);
    else openAccordion(clickedItem);
  };

  triggers.forEach((triggerEl) => {
    const clickHandler = (event: Event) => {
      event.preventDefault();
      handleToggle(item);
    };
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle(item);
      }
    };
    triggerEl.addEventListener('click', clickHandler as EventListener);
    triggerEl.addEventListener('keydown', keyHandler as EventListener);
    listeners.push({ el: triggerEl, type: 'click', handler: clickHandler as EventListener });
    listeners.push({ el: triggerEl, type: 'keydown', handler: keyHandler as EventListener });
  });

  // Return disposer to revert attributes where possible
  return () => {
    const { triggers: currentTriggers, content: currentContent, arrows } = getAccordionParts(item);
    currentTriggers.forEach((t) => {
      // Revert aria wiring we added
      if (t.getAttribute('data-accordion-a11y') === 'true') {
        t.removeAttribute('aria-expanded');
        t.removeAttribute('aria-controls');
        t.removeAttribute('data-accordion-a11y');
      }
      if (t.getAttribute('data-accordion-generated-id') === 'true') {
        t.removeAttribute('id');
        t.removeAttribute('data-accordion-generated-id');
      }
      if (t.getAttribute('data-accordion-role-added') === 'true') {
        if (t.getAttribute('role') === 'button') t.removeAttribute('role');
        t.removeAttribute('data-accordion-role-added');
      }
      if (t.getAttribute('data-accordion-tabindex-added') === 'true') {
        if (t.getAttribute('tabindex') === '0') t.removeAttribute('tabindex');
        t.removeAttribute('data-accordion-tabindex-added');
      }
    });
    if (currentContent) {
      if (currentContent.getAttribute('data-accordion-a11y') === 'true') {
        currentContent.removeAttribute('role');
        currentContent.removeAttribute('aria-hidden');
        if (currentContent.getAttribute('data-accordion-aria-labelledby-added') === 'true') {
          currentContent.removeAttribute('aria-labelledby');
          currentContent.removeAttribute('data-accordion-aria-labelledby-added');
        }
        currentContent.removeAttribute('data-accordion-a11y');
      }
      if (currentContent.getAttribute('data-accordion-generated-id') === 'true') {
        currentContent.removeAttribute('id');
        currentContent.removeAttribute('data-accordion-generated-id');
      }
      gsap.killTweensOf(currentContent);
      currentContent.style.height = '';
    }
    if (arrows.length) {
      arrows.forEach((arrow) => {
        gsap.killTweensOf(arrow);
        gsap.set(arrow, { clearProps: 'transform' });
      });
    }
    item.dataset.state = 'closed';
  };
}

/**
 * Collect key parts of an accordion item.
 * Returns empty arrays/nulls when pieces are missing so callers can guard.
 */
function getAccordionParts(item: AccordionItem): {
  triggers: AccordionItem[];
  content: HTMLElement | null;
  arrows: AccordionItem[];
} {
  const triggers = Array.from(
    item.querySelectorAll(DEFAULT_ACCORDION_OPTIONS.triggerSelector)
  ).filter((t) => t.closest(DEFAULT_ACCORDION_OPTIONS.itemSelector) === item) as AccordionItem[];
  const content = item.querySelector(
    DEFAULT_ACCORDION_OPTIONS.contentSelector
  ) as HTMLElement | null;
  // Only consider arrows within the triggers of this item (not nested items)
  const arrows = triggers.flatMap(
    (t) =>
      Array.from(
        t.querySelectorAll(DEFAULT_ACCORDION_OPTIONS.iconSelector ?? '')
      ) as AccordionItem[]
  );
  return { triggers, content, arrows };
}

/** Open an accordion item with animation and ARIA updates. */
function openAccordion(item: AccordionItem) {
  const { triggers, content, arrows } = getAccordionParts(item);
  if (!triggers.length || !content) return;

  item.dataset.state = 'open';
  triggers.forEach((t) => t.setAttribute('aria-expanded', 'true'));
  content.setAttribute('aria-hidden', 'false');

  gsap.killTweensOf(content);
  gsap.to(content, {
    height: 'auto',
    duration: 0.4,
    ease: 'power2.inOut',
  });

  if (arrows.length) {
    arrows.forEach((arrow) => {
      gsap.killTweensOf(arrow);
      gsap.to(arrow, { rotate: 180, duration: 0.3, ease: 'power2.inOut' });
    });
  }
}

/** Close an accordion item with animation and ARIA updates. */
function closeAccordion(item: AccordionItem) {
  const { triggers, content, arrows } = getAccordionParts(item);
  if (!triggers.length || !content) return;

  // Close any nested open items first
  const nestedOpenItems = item.querySelectorAll(
    `${DEFAULT_ACCORDION_OPTIONS.itemSelector}[data-state="open"]`
  ) as NodeListOf<AccordionItem>;
  nestedOpenItems.forEach((nested) => {
    if (nested !== item) {
      closeAccordion(nested);
    }
  });

  item.dataset.state = 'closed';
  triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
  content.setAttribute('aria-hidden', 'true');

  gsap.killTweensOf(content);
  gsap.to(content, {
    height: 0,
    duration: 0.4,
    ease: 'power2.inOut',
  });

  if (arrows.length) {
    arrows.forEach((arrow) => {
      gsap.killTweensOf(arrow);
      gsap.to(arrow, { rotate: 0, duration: 0.3, ease: 'power2.inOut' });
    });
  }
}

/** Backwards-compatible alias with corrected spelling. */
export const initAccordions = initAccorions;
