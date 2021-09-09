/* eslint-disable max-classes-per-file */
import type { Token } from './types';

export class CircularDepError extends Error {
  requireStack: string[];

  constructor(tokenStack: Token[]) {
    super(`circular dependency for token: ${tokenStack[0].description}`);
    this.requireStack = tokenStack.map((e) => e.description);
  }
}

export class TokenNotFoundError extends Error {
  requireStack: string[];

  constructor(tokenStack: Token[]) {
    super(`token not registered: ${tokenStack[tokenStack.length - 1].description}`);
    this.requireStack = tokenStack.map((e) => e.description);
  }
}

export class ContainerNotReadyError extends Error {
  constructor() {
    super(`container not ready yet, it is illegal to access container before full initialization`);
  }
}
