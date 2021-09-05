import type { Token } from './types';

export const createToken = <T = unknown>(t: string) => Symbol(t) as Token<T>;
