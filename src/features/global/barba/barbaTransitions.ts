// Placeholder for custom transition definitions if needed in the future.
// Currently transitions are defined directly in `barba.ts` inside the init call.
import gsap from 'gsap';

export function animationEnter(container: HTMLElement) {
  return gsap.from(container, {
    duration: 0.6,
    ease: 'power2.inOut',
    opacity: 0,
    clearProps: 'all',
  });
}

export function animationLeave(container: HTMLElement) {
  return gsap.to(container, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut',
    clearProps: 'all',
  });
}
