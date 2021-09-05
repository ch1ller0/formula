import { DI_TOKEN } from '@formula/ioc';
import toPairs from '@tinkoff/utils/object/toPairs';
import { BINDER_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN } from '../tokens';
import type { Provider, Token, ExtractToken } from '@formula/ioc';

export class BinderService {
  private _container: ExtractToken<typeof DI_TOKEN>;

  constructor(deps: [ExtractToken<typeof DI_TOKEN>]) {
    this._container = deps[0];
  }

  initialize() {
    const { fields } = this._container.getByToken(STRUCTURE_SERVICE_TOKEN)._getInitialState();

    toPairs(fields).forEach(([fieldName, { controls }]) => {
      if (controls) {
        controls({
          getBinders: this.getBinders.bind(this),
          getService: this.getService.bind(this),
        }).forEach((element) => element(fieldName));
      }
    });
  }

  getService<T extends Token>(tok: T): ExtractToken<T> {
    return this._container.getByToken(tok);
  }

  getBinders<T extends Token<{ useBinders: any }>>(tok: T): ExtractToken<T> {
    const binderClass = this._container.getByToken(tok);
    if (typeof binderClass.useBinders !== 'function') {
      throw new Error(`token: ${tok.toString()} has no useBinders method`);
    }
    return this._container.getByToken(tok).useBinders();
  }
}

export type TBinderService = InstanceType<typeof BinderService>;

export const binderProvider: Provider<TBinderService> = {
  provide: BINDER_SERVICE_TOKEN,
  useClass: BinderService,
  deps: [DI_TOKEN],
};
