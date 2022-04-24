import { Observable } from 'rxjs';
import type { Atom } from '@reatom/core';
import type { BinderReturn } from '@formula/core-types';

export type ScreenState = {
  currentScreen: number;
  blocked: Record<number, boolean>;
};

export type SetBlockArgs = { screenNum: string; value: boolean };

type ScreenActions = {
  blockScreen(args: SetBlockArgs): void;
  nextScreen(): void;
};

export type ScreenService = {
  getRxStore: () => Observable<ScreenState>;
  blockScreen(args: SetBlockArgs): void;
  nextScreen(): void;
  _getRenderDeps(): {
    atom: Atom<ScreenState>;
  };
} & ScreenActions;

export type ScreenBinders = {
  nextScreen: () => BinderReturn;
};

export type ScreenStore = {
  atom: Atom<ScreenState>;
  actions: ScreenActions;
};
