import { distinctUntilChanged, filter, mapTo, sample, map } from 'rxjs/operators';
import { injectable } from '@fridgefm/inverter';
import { declareAction, declareAtom } from '@reatom/core';
import noop from '@tinkoff/utils/function/noop';
import propSet from '@tinkoff/utils/object/propSet';
import {
  FIELD_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
  SCREEN_SERVICE_TOKEN,
  SCREEN_BINDERS_TOKEN,
  SCREEN_STORE_TOKEN,
} from './tokens';
import { toRxStore } from './state.util';

import type { SetBlockArgs, ScreenState } from './screen.types';

export const screenProviders = [
  injectable({
    provide: SCREEN_STORE_TOKEN,
    useFactory: (globalStore) => {
      const screenIncrementAction = declareAction('screen.increment');
      const screenBlockAction = declareAction<SetBlockArgs>('screen.block');

      const atom = declareAtom<ScreenState>(
        ['screen'],
        {
          currentScreen: 0,
          blocked: {},
        },
        (on) => [
          on(screenIncrementAction, (state) => ({
            ...state,
            currentScreen: state.currentScreen + 1,
          })),
          on(screenBlockAction, (state, { screenNum, value }) => ({
            ...state,
            blocked: propSet(screenNum, value, state.blocked),
          })),
        ],
      );

      globalStore.subscribe(atom, noop);

      return {
        atom,
        actions: {
          nextScreen: () => globalStore.dispatch(screenIncrementAction()),
          blockScreen: (a: SetBlockArgs) => globalStore.dispatch(screenBlockAction(a)),
        },
      };
    },
    inject: [GLOBAL_STORE_TOKEN] as const,
  }),
  injectable({
    provide: SCREEN_SERVICE_TOKEN,
    useFactory: (globalStore, screenStore) => {
      const rxStore = toRxStore(globalStore, screenStore.atom);

      return { ...screenStore.actions, getRxStore: () => rxStore };
    },
    inject: [GLOBAL_STORE_TOKEN, SCREEN_STORE_TOKEN] as const,
  }),
  injectable({
    provide: SCREEN_BINDERS_TOKEN,
    useFactory: (screenService, fieldService) => {
      return {
        nextScreen: () => (fieldName) => {
          const buttonClick$ = fieldService.getDiffRx().pipe(
            // watch only for this button clicked
            filter(({ fieldName: name }) => name === fieldName),
            // need nothing from data - only timings
            mapTo(`click$:${fieldName}`),
          );

          screenService
            .getRxStore()
            .pipe(
              // @TODO need optimization - value should not be emitted if states are equal
              distinctUntilChanged(),
              // emit only when button pressed
              sample(buttonClick$),
              // get boolean of ability to go to next screen
              map(({ currentScreen, blocked }) => blocked[currentScreen]),
            )
            .subscribe((stepBlocked) => {
              if (!stepBlocked) {
                screenService.nextScreen();
              }
            });
        },
      };
    },
    inject: [SCREEN_SERVICE_TOKEN, FIELD_SERVICE_TOKEN] as const,
  }),
];
