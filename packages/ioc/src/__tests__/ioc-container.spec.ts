import { DependencyContainer } from '../ioc-container';
import range from '@tinkoff/utils/array/range';
import { createProviders } from './test-utils';

describe('ProviderContainer', () => {
  describe('basics', () => {
    it('single value', () => {
      const providers = createProviders([
        {
          provide: 'valueToken',
          type: 'value',
        },
      ]);

      const container = new DependencyContainer(providers);
      expect(container.getByToken('valueToken')).toEqual('value:valueToken');
    });

    it('shadowing', () => {
      const providers = createProviders([
        {
          provide: 'sharedToken',
          type: 'value' as const,
          implementation: 1,
        },
        {
          provide: 'sharedToken',
          type: 'value' as const,
          implementation: 2,
        },
      ]);

      const container = new DependencyContainer(providers);
      expect(container.getByToken('sharedToken')).toEqual(2); // uses latest implementation
    });
  });

  it('straight dep chain', () => {
    const providers = createProviders([
      {
        provide: 'third',
        type: 'class',
        deps: ['first', 'second'],
      },
      {
        provide: 'first',
        type: 'value',
        implementation: 'bibka',
      },
      {
        provide: 'second',
        type: 'factory',
        deps: ['first'],
      },
    ]);

    const container = new DependencyContainer(providers);
    const firstDep = container.getByToken('first');
    const secondDep = container.getByToken('second');
    const thirdDep = container.getByToken('third');
    expect(thirdDep.isClass).toEqual(true);
    expect(thirdDep.getDep(0)).toEqual(firstDep);
    expect(thirdDep.getDep(1)).toEqual(secondDep); // should be same pointer
  });

  describe('not existent token', () => {
    it('token not found during init', () => {
      expect.assertions(2);
      const providers = createProviders([
        {
          provide: 'second',
          type: 'factory',
          deps: ['first', 'non_existent'], // no such token
        },
        {
          provide: 'first',
          type: 'value',
        },
      ]);

      try {
        const container = new DependencyContainer(providers);
      } catch (e) {
        expect(e.message).toEqual('token not registered: non_existent');
        expect(e.requireStack).toEqual(['second', 'non_existent']);
      }
    });

    it('token not found of creation', () => {
      expect.assertions(1);
      const providers = createProviders([
        {
          provide: 'first',
          type: 'value',
        },
      ]);
      try {
        const container = new DependencyContainer(providers);
        const provider = container.getByToken('non_existent');
      } catch (e) {
        expect(e.message).toEqual('token not registered: non_existent');
      }
    });
  });

  describe('circular dependencies', () => {
    it('to itself', () => {
      expect.assertions(2);
      const providers = createProviders([
        {
          provide: 'first',
          type: 'value',
          implementation: 'bibka',
        },
        {
          provide: 'second',
          type: 'factory',
          deps: ['first', 'second'], // points to itself
        },
      ]);

      try {
        const container = new DependencyContainer(providers);
      } catch (e) {
        expect(e.message).toEqual('circular dependency for token: second');
        expect(e.requireStack).toEqual(['second']);
      }
    });

    it('triangle', () => {
      expect.assertions(2);
      const providers = createProviders([
        {
          provide: 'first',
          type: 'factory',
          deps: ['second'],
        },
        {
          provide: 'second',
          type: 'factory',
          deps: ['third'],
        },
        {
          provide: 'third',
          type: 'factory',
          deps: ['first'],
        },
      ]);

      try {
        const container = new DependencyContainer(providers);
      } catch (e) {
        expect(e.message).toEqual('circular dependency for token: third');
        expect(e.requireStack).toEqual(['third', 'first', 'second']);
      }
    });

    it('for many providers', () => {
      expect.assertions(3);
      const array = range(0, 101);
      const providers = createProviders(
        array.map((x) => ({
          type: 'factory',
          provide: `token-${x}`,
          deps: [`token-${x === array.length - 1 ? 0 : x + 1}`],
        })),
      );

      try {
        const container = new DependencyContainer(providers);
      } catch (e) {
        expect(e.message).toEqual('circular dependency for token: token-100');
        expect(e.requireStack.length).toEqual(101);
        const expectedStack = [
          'token-100',
          ...range(0, 100).map((x) => `token-${x}`),
        ];
        expect(e.requireStack).toEqual(expectedStack);
      }
    });
  });
});
