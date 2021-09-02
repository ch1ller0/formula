export class CircularDepError extends Error {
  requireStack: string[];
  constructor(requireStack: string[]) {
    super(`circular dependency for token: ${requireStack[0]}`);
    this.requireStack = requireStack;
  }
}

export class TokenNotFoundError extends Error {
  requireStack: string[];
  constructor(requireStack: string[]) {
    super(`token not registered: ${requireStack[requireStack.length - 1]}`);
    this.requireStack = requireStack;
  }
}
