import each from '@tinkoff/utils/object/each';
import {
  CircularDepError,
  TokenNotFoundError,
  ProviderNotReady,
} from './errors';
import type { Provider, Token, IocRecord } from './types';

type Storage = Record<Token, IocRecord>;

const getRequireStack = (current: IocRecord, storage: Storage) => {
  const requireStack: Token[] = [current.provider.provide];
  const follow = (currentRec: IocRecord): Token[] => {
    const prevUnresolved = currentRec.provider.deps?.find(
      (x) => storage[x].marker === 1,
    ) as Token;

    if (prevUnresolved === current.provider.provide) {
      return requireStack;
    }
    requireStack.push(prevUnresolved);
    return follow(storage[prevUnresolved]);
  };

  return follow(current);
};

export const DI_TOKEN = Symbol('di-container');

export class DependencyContainer {
  private _providerStorage: Storage = {};

  constructor(externalPrs: Provider[]) {
    const prs: Provider[] = [
      ...externalPrs,
      {
        // add di token provider to have access for container
        provide: DI_TOKEN,
        useFactory: () => this,
      },
    ];

    this._providerStorage = prs.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.provide]: { provider: cur, marker: 2 as const },
      };
    }, {} as Record<string, IocRecord>);

    const resolveSingle = (currentRecord: IocRecord) => {
      // already resolved previously
      if (currentRecord.resolved) {
        return currentRecord.resolved;
      }
      // mark current record as processing
      this._providerStorage[currentRecord.provider.provide].marker = 1;

      if (currentRecord.provider.useValue) {
        // useValue does not need dependencies so we can resolve it right away
        const res: IocRecord = {
          provider: currentRecord.provider,
          resolved: currentRecord.provider.useValue,
          marker: 0 as const,
        };
        this._providerStorage[currentRecord.provider.provide] = res;
        return res.resolved;
      }

      const resolvedDeps = (currentRecord.provider.deps || []).map(
        (deptoken) => {
          const depRecord = this._providerStorage[deptoken];
          if (!depRecord) {
            throw new TokenNotFoundError([
              currentRecord.provider.provide.toString(),
              deptoken.toString(),
            ]);
          }

          // circular dependency detected
          if (depRecord.marker === 1) {
            throw new CircularDepError(
              getRequireStack(currentRecord, this._providerStorage),
            );
          }
          return resolveSingle(depRecord);
        },
      );

      if (currentRecord.provider.useFactory) {
        const res: IocRecord = {
          provider: currentRecord.provider,
          resolved: currentRecord.provider.useFactory(resolvedDeps),
          marker: 0 as const,
        };
        this._providerStorage[currentRecord.provider.provide] = res;
        return res.resolved;
      }

      if (currentRecord.provider.useClass) {
        const res: IocRecord = {
          provider: currentRecord.provider,
          resolved: new currentRecord.provider.useClass(resolvedDeps),
          marker: 0 as const,
        };
        this._providerStorage[currentRecord.provider.provide] = res;
        return res.resolved;
      }
    };

    // for string keys
    each((val) => {
      resolveSingle(val);
    }, this._providerStorage);

    // for symbol keys
    Object.getOwnPropertySymbols(this._providerStorage).forEach((e) => {
      resolveSingle(this._providerStorage[e]);
    });
  }

  getByToken(token: Provider['provide']): any {
    const provider = this._providerStorage[token];
    if (!provider) {
      throw new TokenNotFoundError([token.toString()]);
    }
    if (provider.marker !== 0) {
      throw new ProviderNotReady(provider.provider);
    }

    return provider.resolved;
  }
}
