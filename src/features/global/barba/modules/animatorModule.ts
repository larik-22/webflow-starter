import { initAnimator } from '$features/global/animator/animator';
import type { GlobalModule } from '$types/page';

export const animatorModule: GlobalModule = {
  onEnter: initAnimator,
  onOnce: initAnimator,
};
