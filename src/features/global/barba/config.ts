import { webflowReset } from '$features/global/modules/webflowReset';
import { homepage } from '$pages/homepage';

/**
 * @description
 * The options for initializing barba.
 * Initialize page-specific modules & global core modules here
 */
export const barbaConfig = {
  globals: [webflowReset],
  pages: [homepage],
};
