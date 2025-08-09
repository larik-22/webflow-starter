import type { PageModule } from '$types/page';
import { composeFeatures } from '$types/page';

//TODO interface for page functions so they follow the same pattern
// Example feature: mount handlers and return a cleanup
function logFeature() {
  // setup
  // eslint-disable-next-line no-console
  console.log('[homepage] feature mounted');
  return () => {
    // eslint-disable-next-line no-console
    console.log('[homepage] feature cleaned');
  };
}

const initHomepage = composeFeatures([logFeature]);

export const homepage: PageModule = {
  namespace: 'home',
  async onEnter({ container }) {
    const cleanup = await initHomepage({ container, namespace: 'home', isFirstLoad: false });
    return cleanup;
  },
};
