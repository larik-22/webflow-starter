import { accordionModule } from '$features/global/barba/modules/accordionModule';
import { animatorModule } from '$features/global/barba/modules/animatorModule';
import { webflowReset } from '$features/global/barba/modules/webflowReset';
import { homepage } from '$pages/homepage';

/**
 * @description
 * The options for initializing barba.
 * Initialize page-specific modules & global core modules here
 */
export const barbaConfig = {
  globals: [webflowReset, animatorModule, accordionModule],
  pages: [homepage],
};
