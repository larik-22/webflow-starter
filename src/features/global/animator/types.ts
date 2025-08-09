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
