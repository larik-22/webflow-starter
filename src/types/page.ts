export type DestroyFunction = () => void;

export type Cleanup = void | DestroyFunction | { destroy: DestroyFunction };

export type RouteSide = {
  namespace?: string;
};

/**
 * @description
 * The base context for a barba page.
 */
export type BasePageContext = {
  /** Barba container element for the current page */
  container: HTMLElement;
  /** Current page namespace (from data-barba-namespace) */
  namespace: string;
  /** True on the first load before any Barba navigation */
  isFirstLoad: boolean;
};

export type PageEnterContext = BasePageContext & {
  from?: RouteSide;
};

export type PageLeaveContext = BasePageContext & {
  to?: RouteSide;
};

export interface PageModule {
  /**
   * @description
   * One or more namespaces this module is responsible for.
   * If omitted, the module is considered global and will run on every page via Barba hooks.
   */
  namespace?: string | string[];

  /** Called before the page becomes visible. Return cleanup to auto-dispose on leave. */
  onEnter?(context: PageEnterContext): Cleanup | Promise<Cleanup>;

  /**
   * Global-only: receive raw Barba hook data on the global `enter` hook.
   * Useful when you need access to `data.next.html` (e.g., Webflow reset).
   */
  onEnterData?(data: BarbaHookData): void | Promise<void>;

  /**
   * Called once on the very first page load. Return cleanup to auto-dispose on first leave.
   */
  onOnce?(context: PageEnterContext): Cleanup | Promise<Cleanup>;

  /**
   * Global-only: receive raw Barba hook data on the global `once` hook.
   */
  onOnceData?(data: BarbaHookData): void | Promise<void>;

  /** Called before leaving the page (animations can still be running). */
  onLeave?(context: PageLeaveContext): void | Promise<void>;

  /** Called after the page is visible and any transition finished. */
  onEnterCompleted?(context: PageEnterContext): void | Promise<void>;

  /** Called after the page has left and transition finished. */
  onLeaveCompleted?(context: PageLeaveContext): void | Promise<void>;
}

export type Feature<TContext extends BasePageContext = BasePageContext> = (
  context: TContext
) => Cleanup | Promise<Cleanup>;

/**
 * @description
 * Utility to combine multiple features into a single initializer that returns a merged cleanup.
 * @param features - An array of features to compose.
 * @returns A single feature that combines the input features.
 * @example
 * const cleanup = composeFeatures([feature1, feature2]);
 * cleanup();
 */
export function composeFeatures<TContext extends BasePageContext = BasePageContext>(
  features: Array<Feature<TContext>>
): Feature<TContext> {
  return async (context: TContext) => {
    const disposers: DestroyFunction[] = [];

    for (const feature of features) {
      const cleanup = await feature(context);
      if (!cleanup) continue;
      if (typeof cleanup === 'function') disposers.push(cleanup);
      else if (typeof cleanup === 'object' && typeof cleanup.destroy === 'function')
        disposers.push(cleanup.destroy);
    }

    if (disposers.length === 0) return;
    return () => {
      for (const dispose of disposers) dispose();
    };
  };
}

/**
 * @description
 * The data passed to Barba hooks.
 */
export type BarbaHookData = {
  current?: { container?: HTMLElement; namespace?: string };
  next?: { container?: HTMLElement; namespace?: string };
};

/**
 * @description
 * The global module type, which is the same as the page module type but without the namespace property.
 */
export type GlobalModule = Omit<PageModule, 'namespace'>;

/**
 * @description
 * The options for initializing a barba page.
 */
export type InitOptions = {
  /** Global modules executed via Barba global hooks on every page */
  globals?: GlobalModule[];
  /** Namespaced page modules executed via Views hooks */
  pages?: PageModule[];
};
