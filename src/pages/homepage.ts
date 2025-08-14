import { logFeature } from '$features/homepage/logFeature';
import type { PageModule } from '$types/page';
import { composeFeatures } from '$types/page';

/**
 * This is a example placeholder page module, it is showcased how to use the `composeFeatures` function to compose multiple features into a single page module.
 * It is also showcased how to use the `onEnter` and `onLeave` hooks to clean up the page.
 */

const initHomepage = composeFeatures([logFeature]);

export const homepage: PageModule = {
  namespace: 'home',
  async onEnter({ container, namespace, isFirstLoad }) {
    const cleanup = await initHomepage({ container, namespace, isFirstLoad });
    return cleanup;
  },
};
