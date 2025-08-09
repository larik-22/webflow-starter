import type { GlobalModule } from '$types/page';

import { initAnimator } from './animator';

export const animatorModule: GlobalModule = {
  onEnter: initAnimator,
  onOnce: initAnimator,
};
