import { createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { GLOBAL_STORE_TOKEN } from '../tokens';
import type { Provider } from '@formula/ioc';
import type { GlobalStore } from './global-store.types';

export const globalStoreProvider: Provider<GlobalStore> = {
  provide: GLOBAL_STORE_TOKEN,
  useFactory: () => {
    const store = createStore();

    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      connectReduxDevtools(store);
    }

    return store;
  },
};
