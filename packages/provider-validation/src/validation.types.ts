import type { TProvider, TBase } from '@formula/core';

export type FieldState = Record<string, TBase.TPrimitive>;
export type ChangeKeyValArgs = {
  name: string;
  value: TBase.TPrimitive;
};

export type TValidationService = TProvider.TProviderService;
