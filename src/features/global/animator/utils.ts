import gsap from 'gsap';

export function parseKinds(attr: string | null | undefined): string[] {
  if (!attr) return [];
  return attr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function readNumber(el: HTMLElement, name: string, fallback?: number): number | undefined {
  const raw = el.getAttribute(name);
  if (raw == null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function readBoolean(el: HTMLElement, name: string, fallback = false): boolean {
  const raw = el.getAttribute(name);
  if (raw == null) return fallback;
  if (raw === '' || raw.toLowerCase() === 'true') return true;
  if (raw.toLowerCase() === 'false') return false;
  return fallback;
}

export function restoreVisibility(el: HTMLElement) {
  if (el.getAttribute('data-prevent-flicker') === 'true') {
    gsap.set(el, { autoAlpha: 1, visibility: 'visible' });
  }
}

export async function waitForFonts(): Promise<void> {
  if (document?.fonts && typeof document.fonts.ready?.then === 'function') {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }
}
