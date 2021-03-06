import React from 'react';
import { ContainerConfiguration, declareContainer, injectable } from '@fridgefm/inverter';
import { CoreModule, CoreTokens } from '@formula/module-core';
import { StructureFactory } from '@formula/core-types';

const {
  RENDERER_FN_TOKEN,
  GLOBAL_STORE_TOKEN,
  BINDER_SERVICE_TOKEN,
  ROOT_CONTAINER_GET_TOKEN,
  STRUCTURE_CONFIG_TOKEN,
} = CoreTokens;

export const formBuilder = () => {
  const initialConfig: ContainerConfiguration = { modules: [CoreModule], providers: [] };
  const instance = {
    configure: (cfg: Pick<ContainerConfiguration, 'modules' | 'providers'>) => {
      cfg.modules?.forEach((injectedModule) => {
        initialConfig.modules?.push(injectedModule);
      });
      cfg.providers.forEach((injectedProvider) => {
        initialConfig.providers?.push(injectedProvider);
      });
      return instance;
    },
    build: (factory: StructureFactory) => {
      const depContainer = declareContainer({
        modules: initialConfig.modules,
        providers: [
          ...initialConfig.providers,
          injectable({
            provide: ROOT_CONTAINER_GET_TOKEN,
            useFactory: () => depContainer.get,
          }),
          injectable({
            provide: STRUCTURE_CONFIG_TOKEN,
            useValue: factory,
          }),
        ],
      });

      return {
        toComponent(CoreWrapper?: React.FC): React.ReactNode {
          // initialize bindings for fields
          depContainer.get(BINDER_SERVICE_TOKEN).initialize();
          // @TODO create logger provider
          // eslint-disable-next-line no-console
          console.log('before-render-state:', depContainer.get(GLOBAL_STORE_TOKEN).getState());
          const renderer = depContainer.get(RENDERER_FN_TOKEN);

          return renderer(CoreWrapper);
        },
      };
    },
  };

  return instance;
};
