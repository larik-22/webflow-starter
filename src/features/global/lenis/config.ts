/**
 * @description
 * The options for initializing lenis.
 */
export const lenisConfig = {
  duration: 1.2,
  easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
  wheelMultiplier: 1,
};
