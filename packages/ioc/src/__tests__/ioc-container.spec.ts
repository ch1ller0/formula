import range from '@tinkoff/utils/array/range';
import { createToken } from '../create-token';
import { DependencyContainer, DI_TOKEN } from '../ioc-container';
import { createProviders } from './test-utils';

describe('DependencyContainer', () => {
  describe('basics', () => {
    it('single value', () => {
      const token = createToken('valueToken');
      const providers = createProviders([
        {
          provide: token,
          type: 'value',
        },
      ]);

      const container = new DependencyContainer(providers);
      expect(container.getByToken(token)).toEqual('value:valueToken');
    });

    it('shadowing', () => {
      const sharedToken = createToken('shared-token');
      const providers = createProviders([
        {
          provide: sharedToken,
          type: 'value' as const,
          implementation: 1,
        },
        {
          provide: sharedToken,
          type: 'value' as const,
          implementation: 2,
        },
      ]);

      const container = new DependencyContainer(providers);
      expect(container.getByToken(sharedToken)).toEqual(2); // uses latest implementation
    });
  });

  it('straight dep chain', () => {
    const firstToken = createToken('first');
    const secondToken = createToken('second');
    const thirdToken = createToken('third');
    const providers = createProviders([
      {
        provide: thirdToken,
        type: 'class',
        deps: [firstToken, secondToken],
      },
      {
        provide: firstToken,
        type: 'value',
        implementation: 'bibka',
      },
      {
        provide: secondToken,
        type: 'factory',
        deps: [firstToken],
      },
    ]);

    const container = new DependencyContainer(providers);
    const firstDep = container.getByToken(firstToken);
    const secondDep = container.getByToken(secondToken);
    const thirdDep = container.getByToken(thirdToken);
    // @ts-ignore
    expect(thirdDep.isClass).toEqual(true);
    // @ts-ignore
    expect(thirdDep.getDep(0)).toEqual(firstDep);
    // @ts-ignore
    expect(thirdDep.getDep(1)).toEqual(secondDep); // should be same pointer
  });

  it('complex dep graph', () => {
    const firstToken = createToken('first');
    const secondToken = createToken('second');
    const thirdToken = createToken('third');
    const providers = createProviders([
      {
        provide: firstToken,
        type: 'class',
        deps: [secondToken, thirdToken],
      },
      {
        provide: secondToken,
        type: 'class',
        deps: [thirdToken],
      },
      {
        provide: thirdToken,
        type: 'factory',
      },
    ]);

    const container = new DependencyContainer(providers);
    const firstDep = container.getByToken(firstToken);
    const secondDep = container.getByToken(secondToken);
    const thirdDep = container.getByToken(thirdToken);
    // @ts-ignore
    expect(firstDep.isClass).toEqual(true);
    // @ts-ignore
    expect(firstDep.getDep(0)).toEqual(secondDep);
    // @ts-ignore
    expect(firstDep.getDep(1)).toEqual(thirdDep);
    // @ts-ignore
    expect(thirdDep('as')).toEqual(':as');
    // @ts-ignore
    expect(secondDep.isClass).toEqual(true);
  });

  describe('not existent token', () => {
    it('token not found during init', () => {
      expect.assertions(2);
      const firstToken = createToken('first');
      const secondToken = createToken('second');
      const nonExistentToken = createToken('non_existent');
      const providers = createProviders([
        {
          provide: secondToken,
          type: 'factory',
          deps: [firstToken, nonExistentToken], // no such token
        },
        {
          provide: firstToken,
          type: 'value',
        },
      ]);

      try {
        const container = new DependencyContainer(providers);
        container.getByToken(secondToken);
      } catch (e) {
        expect(e.message).toEqual('token not registered: non_existent');
        expect(e.requireStack).toEqual(['second', 'non_existent']);
      }
    });

    it('token not found of creation', () => {
      expect.assertions(1);
      const firstToken = createToken('first');
      const nonExistentToken = createToken('non_existent');
      const providers = createProviders([
        {
          provide: firstToken,
          type: 'value',
        },
      ]);
      try {
        const container = new DependencyContainer(providers);
        container.getByToken(nonExistentToken);
      } catch (e) {
        expect(e.message).toEqual('token not registered: non_existent');
      }
    });
  });

  describe('circular dependencies', () => {
    it('to itself', () => {
      const firstToken = createToken('first');
      const secondToken = createToken('second');

      expect.assertions(2);
      const providers = createProviders([
        {
          provide: firstToken,
          type: 'value',
          implementation: 'bibka',
        },
        {
          provide: secondToken,
          type: 'factory',
          deps: [firstToken, secondToken], // points to itself
        },
      ]);

      try {
        const container = new DependencyContainer(providers);
        container.getByToken(firstToken);
      } catch (e) {
        expect(e.message).toEqual('circular dependency for token: second');
        expect(e.requireStack).toEqual(['second']);
      }
    });

    it('triangle', () => {
      expect.assertions(2);
      const firstToken = createToken('first');
      const secondToken = createToken('second');
      const thirdToken = createToken('third');
      const providers = createProviders([
        {
          provide: firstToken,
          type: 'factory',
          deps: [secondToken],
        },
        {
          provide: secondToken,
          type: 'factory',
          deps: [thirdToken],
        },
        {
          provide: thirdToken,
          type: 'factory',
          deps: [firstToken],
        },
      ]);

      try {
        const container = new DependencyContainer(providers);
        container.getByToken(firstToken);
      } catch (e) {
        expect(e.message).toEqual('circular dependency for token: third');
        expect(e.requireStack).toEqual(['third', 'first', 'second']);
      }
    });

    it('for many providers', () => {
      expect.assertions(3);
      const array = range(0, 101);
      const tokens = array.map((x) => createToken(`token-${x}`));

      const providers = createProviders(
        array.map((x) => ({
          type: 'factory',
          provide: tokens[x],
          deps: [tokens[x === array.length - 1 ? 0 : x + 1]],
        })),
      );

      try {
        const container = new DependencyContainer(providers);
        container.getByToken(tokens[0]);
      } catch (e) {
        expect(e.message).toEqual('circular dependency for token: token-100');
        expect(e.requireStack.length).toEqual(101);
        const expectedStack = ['token-100', ...range(0, 100).map((x) => `token-${x}`)];
        expect(e.requireStack).toEqual(expectedStack);
      }
    });
  });

  describe('features', () => {
    describe('di container exposes itself', () => {
      it('available as another provider dependency', () => {
        const firstToken = createToken('first');
        const providers = createProviders([
          {
            provide: firstToken,
            type: 'factory',
            deps: [DI_TOKEN],
            implementation: (deps) => {
              return () => ['some-val', deps[0]];
            },
          },
        ]);
        const container1 = new DependencyContainer(providers);
        const firstProvide = container1.getByToken(firstToken);
        // @ts-ignore
        expect(container1).toEqual(firstProvide()[1]);
      });

      it('not available via getByToken', () => {
        expect.assertions(1);
        try {
          const firstToken = createToken('first');
          const providers = createProviders([{ provide: firstToken, type: 'value' }]);
          const container1 = new DependencyContainer(providers);
          container1.getByToken(DI_TOKEN);
        } catch (e) {
          expect(e.message).toEqual('token not registered: kernel:di-container');
        }
      });
    });

    describe('container not ready', () => {
      it('throw if trying to get unresolved dependency', () => {
        expect.assertions(1);
        const firstToken = createToken('first');
        const secondToken = createToken('second');

        try {
          const providers = createProviders([
            {
              provide: firstToken,
              type: 'factory',
              deps: [DI_TOKEN],
              implementation: ([diContainer]) => {
                diContainer.getByToken(secondToken); // illegal during dependency creation
              },
            },
            {
              provide: secondToken,
              type: 'value',
            },
          ]);
          const container = new DependencyContainer(providers);
          container.getByToken(firstToken);
        } catch (e) {
          expect(e.message).toEqual(
            'container not ready yet, it is illegal to access container before full initialization',
          );
        }
      });

      it('throw even if dep is resolved', () => {
        expect.assertions(1);
        const firstToken = createToken('first');
        const secondToken = createToken('second');

        try {
          const providers = createProviders([
            {
              provide: secondToken,
              type: 'value',
            },
            {
              provide: firstToken,
              type: 'factory',
              deps: [DI_TOKEN],
              implementation: ([diContainer]) => {
                return diContainer.getByToken(secondToken);
              },
            },
          ]);
          const container = new DependencyContainer(providers);
          container.getByToken(firstToken);
        } catch (e) {
          expect(e.message).toEqual(
            'container not ready yet, it is illegal to access container before full initialization',
          );
        }
      });
    });
  });
});
