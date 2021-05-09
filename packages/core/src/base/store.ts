import { createStore } from '@reatom/core';
import { observe } from '@reatom/observable';
import { from } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';

import type { Observable } from 'rxjs';
import type { Atom } from '@reatom/core';

export const globalStore = createStore();
export const toRxStore = <Stt>(atom?: Atom<Stt>): Observable<Stt> => {
  if (atom) {
    const initialState = globalStore.getState(atom);

    return from(observe(globalStore, atom)).pipe(
      startWith(initialState), // emit initial value after stream creation
      shareReplay(), // multicasting atom state
    );
  }

  return from(observe(globalStore));
};

// toRxStore().subscribe((v) => {
//   console.log('rxStoreGlobal', v);
// });

export type Store = typeof globalStore;
export type RxStore = typeof toRxStore;
