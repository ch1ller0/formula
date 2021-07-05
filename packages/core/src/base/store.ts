import { createStore } from '@reatom/core';
import { observe } from '@reatom/observable';
import { from } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';
import { connectReduxDevtools } from '@reatom/debug';

import type { Observable } from 'rxjs';
import type { Atom, Store } from '@reatom/core';

export const toRxStore = <Stt>(
  globalStore: Store,
  atom?: Atom<Stt>,
): Observable<Stt> => {
  if (atom) {
    const initialState = globalStore.getState(atom);

    // @ts-ignore
    return from(observe(globalStore, atom)).pipe(
      startWith(initialState), // emit initial value after stream creation
      shareReplay(), // multicasting atom state
    );
  }

  // @ts-ignore
  return from(observe(globalStore));
};

export const createGlobalStore = () => {
  const store = createStore();
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    connectReduxDevtools(store);
  }

  return store;
};
