import type { AnimationOptions } from './types';

export const DEFAULT_TEXT_ANIMATION: Required<
  Pick<AnimationOptions, 'opacity' | 'y' | 'duration' | 'stagger' | 'ease'>
> = {
  opacity: 0,
  y: 110,
  duration: 0.8,
  stagger: 0.04,
  ease: 'power2.out',
};

export const DEFAULT_SCROLL_OPTIONS: Required<Pick<AnimationOptions, 'start' | 'end' | 'once'>> = {
  start: 'top 85%',
  end: 'bottom top',
  once: true,
};
