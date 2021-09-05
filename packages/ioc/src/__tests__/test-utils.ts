import type { Provider, Token } from '../types';

type Conf = {
  provide: Token;
  deps?: Token[];
  type: 'value' | 'factory' | 'class';
  implementation?: any;
};

const createDep = (a: Conf) => {
  const shared = {
    provide: a.provide,
    deps: a.deps,
  };
  switch (a.type) {
    case 'value': {
      return {
        ...shared,
        useValue: a.implementation || `value:${a.provide.toString()}`,
      } as Provider;
    }
    case 'factory': {
      return {
        ...shared,
        useFactory:
          a.implementation ||
          ((deps) => (arg: string) => `${deps.join('+')}:${arg}`),
      } as Provider;
    }
    case 'class': {
      return {
        ...shared,
        useClass:
          a.implementation ||
          class Dep {
            isClass = true;
            private deps: any[] = [];
            constructor(deps: any[]) {
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
