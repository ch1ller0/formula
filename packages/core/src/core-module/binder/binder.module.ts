import { DI_TOKEN } from '@formula/ioc';
import toPairs from '@tinkoff/utils/object/toPairs';
import { BINDER_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN } from '../tokens';
import type { Provider, Token, ExtractToken } from '@formula/ioc';
import type { TodoAny } from '@formula/core-types';

export class BinderService {
  private _container: ExtractToken<typeof DI_TOKEN>;

  constructor(deps: [ExtractToken<typeof DI_TOKEN>]) {
    [this._container] = deps;
  }

  initialize() {
    const { fields } = this._container.getByToken(STRUCTURE_SERVICE_TOKEN)._getInitialState();

    toPairs(fields).forEach(([fieldName, { controls }]) => {
      if (controls) {
        // @ts-ignore
        controls({
          getBinders: this.getBinders.bind(this),
          getService: this.getService.bind(this),
          // @ts-ignore
        }).forEach((element) => element(fieldName));
      }
    });
  }

  getService<T extends Token>(tok: T): ExtractToken<T> {
    return this._container.getByToken(tok);
  }

  getBinders<T extends Token<{ useBinders: TodoAny }>>(tok: T): ExtractToken<T> {
    const binderClass = this.getService(tok);

    if (!Object.keys(binderClass.useBinders)) {
      throw new Error(`token: ${tok.toString()} has no useBinders field or it is empty`);
    }
    return binderClass.useBinders;
  }
}

export type TBinderService = InstanceType<typeof BinderService>;

const binderProvider: Provider<TBinderService> = {
  provide: BINDER_SERVICE_TOKEN,
  useClass: BinderService,
  deps: [DI_TOKEN],
};

export const BinderModule = [binderProvider];
