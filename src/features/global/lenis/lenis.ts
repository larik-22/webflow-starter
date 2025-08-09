import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let onLenisScroll: (() => void) | null = null;

export function initLenis(options?: ConstructorParameters<typeof Lenis>[0]) {
  if (instance) return instance;
  instance = new Lenis(options);

  connectScrollTrigger(instance);
  return instance;
}

export function getLenis() {
  return instance;
}

export function destroyLenis() {
  if (instance) {
    disconnectScrollTrigger(instance);
    instance.destroy();
    instance = null;
  }
}

export function updateLenisScrollTrigger() {
  try {
    ScrollTrigger.refresh();
  } catch {
    // ignore if not available yet
  }
}

export function scrollToTopImmediate() {
  if (instance) {
    instance.scrollTo(0, { immediate: true, lock: true });
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}

//TODO verify if works fine
function connectScrollTrigger(lenis: Lenis) {
  onLenisScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onLenisScroll);

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (!lenis) return window.scrollY || window.pageYOffset;
      if (typeof value === 'number') lenis.scrollTo(value, { immediate: true });
      const anyLenis = lenis as unknown as { scroll?: number };
      return anyLenis.scroll ?? window.scrollY ?? window.pageYOffset;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  });

  ScrollTrigger.refresh();
}

function disconnectScrollTrigger(lenis: Lenis) {
  if (onLenisScroll) {
    (lenis as unknown as { off: (event: string, cb: () => void) => void }).off(
      'scroll',
      onLenisScroll
    );
    onLenisScroll = null;
  }
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
