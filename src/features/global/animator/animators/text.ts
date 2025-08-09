import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import type { ElementAnimationConfig } from '../types';
import { DEFAULT_TEXT_ANIMATION } from '../types';
import { waitForFonts } from '../utils';

gsap.registerPlugin(SplitText, ScrollTrigger);

export async function animateTextWords(cfg: ElementAnimationConfig) {
  const { element, options } = cfg;
  await waitForFonts();

  const split = new SplitText(element, {
    type: 'words',
    mask: 'words',
    linesClass: 'line-mask',
    wordsClass: 'word-mask',
    charsClass: 'char-mask',
  });

  const words = split.words && split.words.length > 0 ? split.words : [element];

  const tl = gsap.timeline({ paused: true });
  tl.from(words, {
    opacity: options.opacity ?? DEFAULT_TEXT_ANIMATION.opacity,
    y: options.y ?? DEFAULT_TEXT_ANIMATION.y,
    duration: options.duration ?? DEFAULT_TEXT_ANIMATION.duration,
    stagger: options.stagger ?? DEFAULT_TEXT_ANIMATION.stagger,
    ease: options.ease ?? DEFAULT_TEXT_ANIMATION.ease,
  });

  return { split, tl } as const;
}

export async function animateTextLines(cfg: ElementAnimationConfig) {
  const { element, options } = cfg;
  await waitForFonts();

  const split = new SplitText(element, { type: 'lines', mask: 'lines', linesClass: 'line-mask' });
  const lines = split.lines && split.lines.length > 0 ? split.lines : [element];

  const tl = gsap.timeline({ paused: true });
  tl.from(lines, {
    opacity: options.opacity ?? DEFAULT_TEXT_ANIMATION.opacity,
    y: options.y ?? DEFAULT_TEXT_ANIMATION.y,
    duration: options.duration ?? DEFAULT_TEXT_ANIMATION.duration,
    stagger: options.stagger ?? DEFAULT_TEXT_ANIMATION.stagger,
    ease: options.ease ?? DEFAULT_TEXT_ANIMATION.ease,
  });

  return { split, tl } as const;
}
