import type { Token } from './types';

export const createToken = <T = unknown>(nm: string) => Symbol(nm) as Token<T>;
