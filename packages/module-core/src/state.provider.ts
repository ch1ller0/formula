import { createStore } from '@reatom/core';
import { connectReduxDevtools } from '@reatom/debug';
import { observe } from '@reatom/observable';
import { from } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';
import { injectable } from '@fridgefm/inverter';
import { GLOBAL_STORE_TOKEN, STORE_UTILS_TOKEN } from './tokens';

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
  injectable({
    provide: STORE_UTILS_TOKEN,
    useValue: {
      // @ts-ignore
      toRxStore: (globalStore, atom) => {
        if (atom) {
          const initialState = globalStore.getState(atom);

          return from(observe(globalStore, atom)).pipe(
            startWith(initialState), // emit initial value after stream creation
            shareReplay(), // multicasting atom state
          );
        }

        return from(observe(globalStore));
      },
    },
  }),
];
