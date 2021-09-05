import { observe } from '@reatom/observable';
import { from } from 'rxjs';
import { shareReplay, startWith } from 'rxjs/operators';

import type { Observable } from 'rxjs';
import type { Atom, Store } from '@reatom/core';

export const toRxStore = <Stt>(
  globalStore: Store,
  atom?: Atom<Stt>,
): Observable<Stt> => {
  if (atom) {
    const initialState = globalStore.getState(atom);

    return from(observe(globalStore, atom)).pipe(
      // @ts-ignore
      startWith(initialState), // emit initial value after stream creation
      shareReplay(), // multicasting atom state
    );
  }

  // @ts-ignore
  return from(observe(globalStore));
};
