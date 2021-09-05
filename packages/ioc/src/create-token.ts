import type { Token } from './types';

export const createToken = (t: string) => Symbol(t) as Token;
