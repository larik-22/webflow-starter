import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { GlobalModule } from '$types/page';

import { animateFadeIn } from './animators/basic';
import { animateTextLines, animateTextWords } from './animators/text';
import type {
  AnimationKind,
  AnimationOptions,
  AnimatorCleanup,
  ElementAnimationConfig,
} from './types';
import { parseKinds, readBoolean, readNumber, restoreVisibility } from './utils';

gsap.registerPlugin(ScrollTrigger);

function buildConfig(element: HTMLElement): ElementAnimationConfig | null {
  const shouldAnimate = element.getAttribute('data-animate');
  if (!shouldAnimate || shouldAnimate === 'false') return null;

  const kinds = parseKinds(element.getAttribute('data-animation-type')) as AnimationKind[];
  if (kinds.length === 0) return null;

  const options: AnimationOptions = {
    duration: readNumber(element, 'data-duration'),
    delay: readNumber(element, 'data-delay'),
    stagger: readNumber(element, 'data-stagger'),
    opacity: readNumber(element, 'data-opacity'),
    y: readNumber(element, 'data-y'),
    x: readNumber(element, 'data-x'),
    once: readBoolean(element, 'data-once', true),
    ease: element.getAttribute('data-ease') ?? undefined,
    start: element.getAttribute('data-start') ?? undefined,
    end: element.getAttribute('data-end') ?? undefined,
  };

  const preventFlicker = element.getAttribute('data-prevent-flicker') === 'true';

  return { element, kinds, options, preventFlicker };
}

function createScrollTrigger(element: HTMLElement, play: () => void, options: AnimationOptions) {
  const trigger = ScrollTrigger.create({
    trigger: element,
    scroller: document.documentElement,
    start: options.start ?? 'top 85%',
    end: options.end ?? 'bottom top',
    once: options.once ?? true,
    markers: true,
    toggleActions: 'play none none nones',
    onEnter: play,
  });
  return trigger;
}

export const initAnimator: GlobalModule['onEnter'] | GlobalModule['onOnce'] = async (context) => {
  const { container } = context;
  const animated = Array.from(container.querySelectorAll<HTMLElement>('[data-animate="true"]'));
  const cleanups: AnimatorCleanup[] = [];

  for (const element of animated) {
    const cfg = buildConfig(element);
    if (!cfg) continue;

    // Minimal supported kinds for first pass
    const supportsTextWords = cfg.kinds.includes('text-words');
    const supportsTextLines = cfg.kinds.includes('text-lines');
    const supportsFade = cfg.kinds.includes('fade-in');

    let timeline: gsap.core.Timeline | null = null;
    let splitRef: { revert: () => void } | null = null;
    const createdTrigger: ScrollTrigger | null = null;

    if (supportsTextWords) {
      const res = await animateTextWords(cfg);
      timeline = res.tl;
      splitRef = res.split as unknown as { revert: () => void };
    } else if (supportsTextLines) {
      const res = await animateTextLines(cfg);
      timeline = res.tl;
      splitRef = res.split as unknown as { revert: () => void };
    } else if (supportsFade) {
      timeline = animateFadeIn(cfg);
    }

    if (!timeline && !createdTrigger) continue;

    const trigger =
      createdTrigger ??
      createScrollTrigger(
        element,
        () => {
          if (cfg.preventFlicker) restoreVisibility(element);
          timeline?.play(0);
        },
        cfg.options
      );

    const cleanup: AnimatorCleanup = () => {
      trigger?.kill();
      timeline?.kill();
      splitRef?.revert?.();
      if (cfg.preventFlicker) restoreVisibility(element);
    };

    cleanups.push(cleanup);
  }

  if (cleanups.length === 0) return;
  return () => cleanups.forEach((fn) => fn());
};
