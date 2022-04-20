import { createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { injectable } from '@fridgefm/inverter';
import { GLOBAL_STORE_TOKEN } from '../tokens';

export const stateProviders = [
  injectable({
    provide: GLOBAL_STORE_TOKEN,
    useFactory: () => {
      const store = createStore();

      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        connectReduxDevtools(store);
        // @ts-ignore
        window.__formula = { store };
      }

      return store;
    },
  }),
];
