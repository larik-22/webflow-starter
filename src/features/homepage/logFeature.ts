import type { Feature } from '$types/page';

export const logFeature: Feature = () => {
  // eslint-disable-next-line no-console
  console.log('[homepage] feature mounted');
  return () => {
    // eslint-disable-next-line no-console
    console.log('[homepage] feature cleaned');
  };
};
