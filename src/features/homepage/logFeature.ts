import type { Feature } from '$types/page';

/**
 * This is a example placeholder feature to log when the feature is mounted and cleaned up.
 * @returns A function to clean up the feature.
 */
export const logFeature: Feature = () => {
  //function code
  console.log('[homepage] feature mounted');
  return () => {
    // eslint-disable-next-line no-console
    console.log('[homepage] feature cleaned');
  };
};
