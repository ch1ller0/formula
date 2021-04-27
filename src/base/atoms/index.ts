import { createStore, combine } from '@reatom/core';
import { fieldsAtom } from './fields.atom';
import { stepAtom } from './step.atom';

export const combinedAtom = combine({
  fields: fieldsAtom,
  step: stepAtom,
});

export const combinedStore = createStore(combinedAtom);

combinedStore.subscribe(fieldsAtom, (e) => {
  console.log('fields:new-state', e);
});

combinedStore.subscribe(stepAtom, (e) => {
  console.log('step:new-state', e);
});

export type Store = typeof combinedStore;

// combinedStore.subscribe(combinedAtom, (e) => {
//   console.log('combined', e);
// });
