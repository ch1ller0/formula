import type { TProvider } from '@formula/core';

export const providerFactory = (
  name: string,
  deps: TProvider.TProviderConfig[] = [],
): [any, TProvider.TProviderConfig<any>] => {
  const constructorMock = jest.fn();

  return [
    {
      constructorMock,
    },
    {
      name,
      useService: class FakeService {
        constructor(...args: any[]) {
          constructorMock(...args);
        }
      },
      deps,
    },
  ];
};
