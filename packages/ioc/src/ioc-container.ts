import each from '@tinkoff/utils/object/each';
import { CircularDepError, TokenNotFoundError } from './errors';
import type { Provider } from './types';

type Resolved = unknown;
type IocRecord = {
  provider: Provider;
  marker: keyof typeof MARKER;
  resolved?: Resolved;
};
type Storage = Record<string, IocRecord>;

const MARKER = {
  0: '__resolved',
  1: '__processing',
  2: '__unresolved',
};

const getRequireStack = (current: IocRecord, storage: Storage) => {
  const requireStack: string[] = [current.provider.provide];
  const follow = (currentRec: IocRecord): string[] => {
    const prevUnresolved = currentRec.provider.deps?.find(
      (x) => storage[x].marker === 1,
    ) as string;

    if (prevUnresolved === current.provider.provide) {
      return requireStack;
    }
    requireStack.push(prevUnresolved);
    return follow(storage[prevUnresolved]);
  };

  return follow(current);
};

export class DependencyContainer {
  private _providerStorage: Storage = {};

  constructor(prs: Provider[]) {
    this._providerStorage = prs.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.provide]: { provider: cur, marker: 2 as keyof typeof MARKER },
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
              currentRecord.provider.provide,
              deptoken,
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

    each((val) => {
      resolveSingle(val);
    }, this._providerStorage);
  }

  getByToken(token: Provider['provide']): any {
    const provider = this._providerStorage[token];
    if (!provider) {
      throw new TokenNotFoundError([token]);
    }
    return this._providerStorage[token].resolved;
  }
}
