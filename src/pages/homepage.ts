import { logFeature } from '$features/homepage/logFeature';
import type { PageModule } from '$types/page';
import { composeFeatures } from '$types/page';

const initHomepage = composeFeatures([logFeature]);

export const homepage: PageModule = {
  namespace: 'home',
  async onEnter({ container, namespace, isFirstLoad }) {
    const cleanup = await initHomepage({ container, namespace, isFirstLoad });
    return cleanup;
  },
};
