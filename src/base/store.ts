import { createStore } from '@reatom/core';
import { observe } from '@reatom/observable';
import { from } from 'rxjs';

export const globalStore = createStore();
export const rxGlobalStore = (atom?: unknown) =>
  from(atom ? observe(globalStore, atom) : observe(globalStore));

// rxGlobalStore().subscribe((v) => {
//   console.log('rxStoreGlobal', v);
// });

export type Store = typeof globalStore;
export type RxStore = typeof rxGlobalStore;
