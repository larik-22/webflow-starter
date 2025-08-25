import { initAccordions } from '$features/global/accordion/accordion';
import type { GlobalModule } from '$types/page';

/**
 * Global Barba module that initializes accordions on every page.
 */
export const accordionModule: GlobalModule = {
  onEnter: initAccordions,
  onOnce: initAccordions,
};
