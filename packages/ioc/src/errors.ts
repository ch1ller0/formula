/* eslint-disable max-classes-per-file */
import type { Provider } from './types';

export class CircularDepError extends Error {
  requireStack: string[];

  constructor(requireStack: string[]) {
    super(`circular dependency for token: ${requireStack[0].toString()}`);
    this.requireStack = requireStack.map((e) => e.toString());
  }
}

export class TokenNotFoundError extends Error {
  requireStack: string[];

  constructor(requireStack: string[]) {
    super(`token not registered: ${requireStack[requireStack.length - 1].toString()}`);
    this.requireStack = requireStack;
  }
}

export class ProviderNotReady extends Error {
  constructor(provider: Provider) {
    super(`provider not ready: ${provider.provide.toString()}`);
  }
}
