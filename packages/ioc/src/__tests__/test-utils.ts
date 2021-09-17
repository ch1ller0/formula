import type { Provider, Token } from '../types';
import type { TodoAny } from '@formula/core-types';

type Conf = {
  provide: Omit<Token, '_brand'>;
  deps?: Omit<Token, '_brand'>[];
  type: 'value' | 'factory' | 'class';
  implementation?: TodoAny;
};

// eslint-disable-next-line consistent-return
const createDep = (a: Conf) => {
  const shared = {
    provide: a.provide,
    deps: a.deps,
  };
  switch (a.type) {
    case 'value': {
      return {
        ...shared,
        useValue: a.implementation || `value:${a.provide.description}`,
      } as Provider;
    }
    case 'factory': {
      return {
        ...shared,
        useFactory: a.implementation || ((deps) => (arg: string) => `${deps.join('+')}:${arg}`),
      } as Provider;
    }
    case 'class': {
      return {
        ...shared,
        useClass:
          a.implementation ||
          class Dep {
            isClass = true;

            private deps: TodoAny[] = [];

            constructor(deps: TodoAny[]) {
              this.deps = deps;
            }

            getDep(index: number) {
              return this.deps[index];
            }
          },
      } as Provider;
    }
  }
};

export const createProviders = (confs: Conf[]) => confs.map(createDep);
