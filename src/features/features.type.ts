export type FeatureConfig<T> = {
  name: string;
  useService?: {
    new (a: { getService: any; structure: any }): void;
  };
  useState?(initState: unknown): void;
  deps?: FeatureConfig<{}>[];
};

export type FeatureProvider = {
  service: unknown;
};

/**
 * A feature is a reusable singletone of a logic that might contain
 * 1 A service that might be used by other features
 * 2 An atom used only by itself
 */
