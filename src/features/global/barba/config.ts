import { animatorModule } from '$features/global/animator/module';
import { webflowReset } from '$features/global/modules/webflowReset';
import { homepage } from '$pages/homepage';

/**
 * @description
 * The options for initializing barba.
 * Initialize page-specific modules & global core modules here
 */
export const barbaConfig = {
  globals: [webflowReset, animatorModule],
  pages: [homepage],
};
