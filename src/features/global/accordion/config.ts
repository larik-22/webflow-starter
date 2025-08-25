import type { AccordionOptions } from './types';

export const DEFAULT_ACCORDION_OPTIONS: AccordionOptions = {
  componentSelector: '[data-accordion-component]',
  itemSelector: '[data-accordion-item]',
  triggerSelector: '[data-accordion-trigger]',
  contentSelector: '[data-accordion-content]',
  iconSelector: '[data-accordion-arrow]',
};
