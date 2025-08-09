import type { PageModule } from '$types/page';
import { resetWebflow } from '$utils/destroyWebflow';

export const webflowReset: PageModule = {
  onEnterData: (data) => {
    resetWebflow(data);
  },
};
