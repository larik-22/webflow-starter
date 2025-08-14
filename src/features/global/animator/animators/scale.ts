import gsap from 'gsap';

import { DEFAULT_SCALE_ANIMATION } from '../config';
import type { ElementAnimationConfig } from '../types';
import { restoreVisibility } from '../utils';

export function animateScaleIn(cfg: ElementAnimationConfig) {
  const { element, options } = cfg;

  // set start scale
  gsap.set(element, { scale: DEFAULT_SCALE_ANIMATION.in.endScale });

  // restore visibility
  restoreVisibility(element);

  const toScale = options.scale ?? DEFAULT_SCALE_ANIMATION.in.startScale;
  const tl = gsap.timeline({ paused: true });
  tl.from(element, {
    scale: toScale,
    opacity: options.opacity ?? DEFAULT_SCALE_ANIMATION.in.opacity,
    duration: options.duration ?? DEFAULT_SCALE_ANIMATION.in.duration,
    ease: options.ease ?? DEFAULT_SCALE_ANIMATION.in.ease,
  });

  return tl;
}

export function animateScaleOut(cfg: ElementAnimationConfig) {
  const { element, options } = cfg;
  restoreVisibility(element);

  const fromScale = options.scale ?? DEFAULT_SCALE_ANIMATION.out.scale;
  const tl = gsap.timeline({ paused: true });
  tl.from(element, {
    scale: fromScale,
    opacity: options.opacity ?? DEFAULT_SCALE_ANIMATION.out.opacity,
    duration: options.duration ?? DEFAULT_SCALE_ANIMATION.out.duration,
    ease: options.ease ?? DEFAULT_SCALE_ANIMATION.out.ease,
  });

  return tl;
}
