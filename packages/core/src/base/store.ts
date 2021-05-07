import { createStore } from '@reatom/core';
import { observe } from '@reatom/observable';
import { from } from 'rxjs';

export const globalStore = createStore();
export const toRxStore = (atom?: unknown) =>
  from(atom ? observe(globalStore, atom) : observe(globalStore));

// toRxStore().subscribe((v) => {
//   console.log('rxStoreGlobal', v);
// });

export type Store = typeof globalStore;
export type RxStore = typeof toRxStore;
