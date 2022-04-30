import toPairs from '@tinkoff/utils/object/toPairs';
import { injectable } from '@fridgefm/inverter';
import { BINDER_SERVICE_TOKEN, ROOT_CONTAINER_GET_TOKEN, STRUCTURE_STORE_TOKEN } from './tokens';

export type BinderService = {
  initialize: () => void;
};

export const binderProviders = [
  injectable({
    provide: BINDER_SERVICE_TOKEN,
    useFactory: (rootContainerGet) => {
      const instance: BinderService = {
        initialize: () => {
          const { fields } = rootContainerGet(STRUCTURE_STORE_TOKEN).getState();

          toPairs(fields).forEach(([fieldName, { controls }]) => {
            if (controls) {
              controls(rootContainerGet).forEach((element) => element(fieldName));
            }
          });
        },
      };

      return instance;
    },
    inject: [ROOT_CONTAINER_GET_TOKEN] as const,
  }),
];
