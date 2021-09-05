import { DI_TOKEN } from '@formula/ioc';
import toPairs from '@tinkoff/utils/object/toPairs';
import { BINDER_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN } from '../tokens';
import type { Provider, DependencyContainer, Token } from '@formula/ioc';

class BinderSerivce {
  private _container: DependencyContainer;

  constructor(deps: [DependencyContainer]) {
    this._container = deps[0];
  }

  initialize() {
    const { fields } = this._container
      .getByToken(STRUCTURE_SERVICE_TOKEN)
      ._getInitialState();

    toPairs(fields).map(([fieldName, { controls }]) => {
      if (controls) {
        controls({
          getBinders: this.getBinders.bind(this),
          getService: this.getService.bind(this),
        }).forEach((element) => element(fieldName));
      }
    });
  }

  getService(tok: Token) {
    return this._container.getByToken(tok);
  }

  getBinders(tok: Token) {
    return this._container.getByToken(tok).useBinders?.();
  }
}

export const binderProvider: Provider = {
  provide: BINDER_SERVICE_TOKEN,
  useClass: BinderSerivce,
  deps: [DI_TOKEN],
};
