import { createToken } from './create-token';
import { CircularDepError, TokenNotFoundError, ContainerNotReadyError } from './errors';
import type { Provider, Token, IocRecord, ExtractToken } from './types';

type Storage = Record<Token, IocRecord>;

const getRequireStack = (current: IocRecord, storage: Storage): Token[] => {
  const requireStack: Token[] = [current.provider.provide];
  const follow = (currentRec: IocRecord): Token[] => {
    const prevUnresolved = currentRec.provider.deps?.find((x) => storage[x].marker === 1) as Token;

    if (prevUnresolved === current.provider.provide) {
      return requireStack;
    }
    requireStack.push(prevUnresolved);
    return follow(storage[prevUnresolved]);
  };

  return follow(current);
};

export const DI_TOKEN = createToken<DependencyContainer>('di-container');

export class DependencyContainer {
  private _providerStorage: Storage = {};

  private _allResolved: boolean = false;

  constructor(externalPrs: Provider[]) {
    const prs: Provider[] = [
      ...externalPrs,
      {
        // add di token provider to have access for container
        provide: DI_TOKEN,
        useFactory: () => this,
      },
    ];

    this._providerStorage = prs.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.provide]: { provider: cur, marker: 2 as const },
      }),
      {} as Storage,
    );

    // eslint-disable-next-line consistent-return
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

      const resolvedDeps = (currentRecord.provider.deps || []).map((deptoken) => {
        const depRecord = this._providerStorage[deptoken];
        if (!depRecord) {
          throw new TokenNotFoundError([currentRecord.provider.provide, deptoken]);
        }

        // circular dependency detected
        if (depRecord.marker === 1) {
          throw new CircularDepError(getRequireStack(currentRecord, this._providerStorage));
        }
        return resolveSingle(depRecord);
      });

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
        const Constructor = currentRecord.provider.useClass;
        const res: IocRecord = {
          provider: currentRecord.provider,
          resolved: new Constructor(resolvedDeps),
          marker: 0 as const,
        };
        this._providerStorage[currentRecord.provider.provide] = res;
        return res.resolved;
      }
    };

    // for symbol keys
    Object.getOwnPropertySymbols(this._providerStorage).forEach((e) => {
      // @ts-ignore
      const record = this._providerStorage[e] as IocRecord;
      resolveSingle(record);
    });
    this._allResolved = true;
  }

  getByToken<T extends Token>(token: T): ExtractToken<T> {
    if (!this._allResolved) {
      throw new ContainerNotReadyError();
    }
    const provider = this._providerStorage[token];
    if (!provider || token === DI_TOKEN) {
      throw new TokenNotFoundError([token]);
    }

    return provider.resolved;
  }

  _getResolvedNodes() {
    if (!this._allResolved) {
      throw new ContainerNotReadyError();
    }
    const res: { provide: string; deps: string[] }[] = [];

    Object.getOwnPropertySymbols(this._providerStorage).forEach((e) => {
      // @ts-ignore
      const record = this._providerStorage[e] as IocRecord;
      res.push({
        provide: record.provider.provide.description,
        deps: record.provider.deps?.map((x) => x.description) || [],
      });
    });

    return res;
  }
}
