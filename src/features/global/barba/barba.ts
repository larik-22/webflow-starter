import barba from '@barba/core';
import prefetch from '@barba/prefetch';

import { updateLenisScrollTrigger } from '$features/global/lenis/lenis';
import type { BarbaHookData, Cleanup, InitOptions } from '$types/page';
import { resetWebflow } from '$utils/destroyWebflow';

import { animationEnter, animationLeave } from './barbaTransitions';

const cleanupStack: Array<() => void> = [];

function runCleanup() {
  while (cleanupStack.length) {
    const dispose = cleanupStack.pop();
    try {
      dispose?.();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[barba] cleanup error', err);
    }
  }
}

async function handleCleanup(result: Cleanup) {
  if (!result) return;
  if (typeof result === 'function') cleanupStack.push(result);
  else if (typeof (result as { destroy?: () => void }).destroy === 'function')
    cleanupStack.push((result as { destroy: () => void }).destroy);
}

export function initBarba({ pages }: InitOptions) {
  let isFirstLoad = true;

  // Enable prefetch plugin
  barba.use(prefetch);

  const namespaced = pages.filter((m) => m.namespace !== undefined);
  const globalMods = pages.filter((m) => m.namespace === undefined);

  // Map namespaced modules to Barba Views
  const views = namespaced
    .map((mod) =>
      (Array.isArray(mod.namespace) ? mod.namespace : [mod.namespace as string]).map((ns) => ({
        namespace: ns,
        async beforeEnter(data: BarbaHookData) {
          const container = data.next?.container as HTMLElement;
          const context = {
            container,
            namespace: ns,
            isFirstLoad,
            from: { namespace: data.current?.namespace },
          } as const;
          const res = await mod.onEnter?.(context);
          await handleCleanup(res);
        },
        async afterEnter(data: BarbaHookData) {
          const container = data.next?.container as HTMLElement;
          const context = {
            container,
            namespace: ns,
            isFirstLoad,
            from: { namespace: data.current?.namespace },
          } as const;
          await mod.onEnterCompleted?.(context);
        },
        async beforeLeave(data: BarbaHookData) {
          const container = data.current?.container as HTMLElement;
          const context = {
            container,
            namespace: ns,
            isFirstLoad,
            to: { namespace: data.next?.namespace },
          } as const;
          await mod.onLeave?.(context);
          // cleanup is executed globally in hooks.beforeLeave to ensure single run
        },
        async afterLeave(data: BarbaHookData) {
          const container = data.current?.container as HTMLElement;
          const context = {
            container,
            namespace: ns,
            isFirstLoad,
            to: { namespace: data.next?.namespace },
          } as const;
          await mod.onLeaveCompleted?.(context);
        },
      }))
    )
    .flat();

  barba.init({
    views,
    // Transitions are ONLY for visual animations
    transitions: [
      {
        name: 'fade',
        leave(data: { current?: { container?: HTMLElement } }) {
          animationLeave(data.current?.container as HTMLElement);
        },
        enter(data: { next?: { container?: HTMLElement } }) {
          animationEnter(data.next?.container as HTMLElement);
        },
      },
    ],
  });

  // Global custom code hooks (run on every page)
  barba.hooks.beforeEnter((data: BarbaHookData) => {
    const container = data.next?.container as HTMLElement;
    const namespace = (data.next?.namespace || data.current?.namespace) as string;
    const context = {
      container,
      namespace,
      isFirstLoad,
      from: { namespace: data.current?.namespace },
    };
    return Promise.all(globalMods.map((m) => m.onEnter?.(context))).then(async (cleanups) => {
      for (const c of cleanups) await handleCleanup(c as Cleanup);
    });
  });

  /**
   * @description
   * Reset Webflow on enter to ensure new page is loaded correctly
   */
  barba.hooks.enter((data: BarbaHookData) => {
    resetWebflow(data);
  });

  barba.hooks.afterEnter((data: BarbaHookData) => {
    const container = data.next?.container as HTMLElement;
    const namespace = (data.next?.namespace || data.current?.namespace) as string;
    const context = {
      container,
      namespace,
      isFirstLoad,
      from: { namespace: data.current?.namespace },
    };
    return Promise.all(globalMods.map((m) => m.onEnterCompleted?.(context))).then(() => undefined);
  });

  barba.hooks.beforeLeave((data: BarbaHookData) => {
    const container = data.current?.container as HTMLElement;
    const namespace = (data.current?.namespace || data.next?.namespace) as string;
    const context = { container, namespace, isFirstLoad, to: { namespace: data.next?.namespace } };
    return Promise.all(globalMods.map((m) => m.onLeave?.(context))).then(() => {
      runCleanup();
    });
  });

  barba.hooks.afterLeave((data: BarbaHookData) => {
    const container = data.current?.container as HTMLElement;
    const namespace = (data.current?.namespace || data.next?.namespace) as string;
    const context = { container, namespace, isFirstLoad, to: { namespace: data.next?.namespace } };
    return Promise.all(globalMods.map((m) => m.onLeaveCompleted?.(context))).then(() => undefined);
  });

  // After each navigation, refresh ScrollTrigger and mark first load as false
  barba.hooks.after(() => {
    updateLenisScrollTrigger();
    isFirstLoad = false;
  });
}
