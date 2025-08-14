import type { GlobalModule } from '$types/page';
import { resetWebflow } from '$utils/destroyWebflow';

export const webflowReset: GlobalModule = {
  onEnterData: (data) => {
    resetWebflow(data);
  },
};
