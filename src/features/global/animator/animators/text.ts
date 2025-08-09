import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import type { ElementAnimationConfig } from '../types';
import { restoreVisibility, waitForFonts } from '../utils';

gsap.registerPlugin(SplitText, ScrollTrigger);

export async function animateTextWords(cfg: ElementAnimationConfig) {
  const { element, options, preventFlicker } = cfg;
  console.log('animateTextWords', cfg);
  await waitForFonts();

  let trigger: ScrollTrigger | null = null;

  const split = new SplitText(element, {
    type: 'words',
    linesClass: 'line-mask',
    wordsClass: 'word-mask',
    charsClass: 'char-mask',
    onSplit: () => {
      const words = split.words ?? [];
      const tl = gsap.timeline({ paused: true });
      tl.from(words, {
        opacity: options.opacity ?? 0,
        y: options.y ?? 20,
        duration: options.duration ?? 0.8,
        stagger: options.stagger ?? 0.04,
        ease: options.ease ?? 'power2.out',
        clearProps: 'all',
      });

      trigger = ScrollTrigger.create({
        trigger: element,
        start: options.start ?? 'top 85%',
        end: options.end ?? 'bottom top',
        once: options.once ?? true,
        onEnter: () => {
          if (preventFlicker) restoreVisibility(element);
          tl.play(0);
        },
      });
    },
  });

  return { split, trigger } as const;
}
