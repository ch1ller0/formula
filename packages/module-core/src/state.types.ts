import type { Store as GlobalStore, Atom } from '@reatom/core';
import type { Observable } from 'rxjs';

export type StoreUtils = {
  toRxStore<Stt>(globalStore: GlobalStore, atom?: Atom<Stt>): Observable<Stt>;
};
export type { Store as GlobalStore } from '@reatom/core';
