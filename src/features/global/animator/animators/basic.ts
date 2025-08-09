import gsap from 'gsap';

import type { ElementAnimationConfig } from '../types';
import { restoreVisibility } from '../utils';

export function animateFadeIn(cfg: ElementAnimationConfig) {
  const { element, options } = cfg;
  restoreVisibility(element);

  const tl = gsap.timeline({ paused: true });
  tl.from(element, {
    opacity: options.opacity ?? 0,
    duration: options.duration ?? 0.6,
    ease: options.ease ?? 'power2.out',
    clearProps: 'all',
  });
  return tl;
}
