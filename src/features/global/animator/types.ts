export type AnimationKind = 'text-words' | 'text-lines' | 'text-chars' | 'fade-in' | 'slide-in';

export type AnimationOptions = {
  duration?: number;
  delay?: number;
  stagger?: number;
  opacity?: number;
  y?: number;
  x?: number;
  ease?: string;
  start?: string;
  end?: string;
  once?: boolean;
};

export type ElementAnimationConfig = {
  element: HTMLElement;
  kinds: AnimationKind[];
  options: AnimationOptions;
  preventFlicker: boolean;
};

export type AnimatorCleanup = () => void;

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
