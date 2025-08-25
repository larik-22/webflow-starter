export type AccordionOptions = {
  /**
   * The selector for the accordion component.
   * @default '[data-accordion-component]'
   */
  componentSelector: string;
  /**
   * The selector for the accordion item.
   * @default '[data-accordion-item]'
   */
  itemSelector: string;
  /**
   * The selector for the accordion trigger.
   * @default '[data-accordion-trigger]'
   */
  triggerSelector: string;
  /**
   * The selector for the accordion content.
   * @default '[data-accordion-content]'
   */
  contentSelector: string;
  /**
   * The selector for the accordion arrow.
   * @default '[data-accordion-arrow]'
   */
  iconSelector?: string;
};

export type AccordionItem = HTMLElement & {
  dataset: {
    state: 'open' | 'closed';
  };
};

/** Options for initializing a single accordion item. */
export type InitializeItemOptions = {
  /** Function that returns a new unique number each time it's called */
  autoIdCounterRef: () => number;
  /** Whether to enforce that only one sibling item is open inside the component */
  enforceSingleOpenWithinComponent: boolean;
};
