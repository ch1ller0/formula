import { STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN, PROPS_SERVICE_TOKEN } from '../tokens';
import { useState } from './props.state';
import type { ExtractToken, Provider } from '@formula/ioc';
import type { TPropsService, Props } from './props.types';

const propsFactory = (
  deps: [ExtractToken<typeof STRUCTURE_SERVICE_TOKEN>, ExtractToken<typeof GLOBAL_STORE_TOKEN>],
) => {
  const [structureService, globalStore] = deps;
  const structure = structureService._getInitialState();
  const selfState = useState({ globalStore, structure });

  return {
    setFieldProp: (name: string, value: Props) => {
      selfState.actions.changeFieldProps({ name, value });
    },
    _getRenderDeps: () => ({ atom: selfState._atom }),
  };
};

const propsProvider: Provider<TPropsService> = {
  provide: PROPS_SERVICE_TOKEN,
  useFactory: propsFactory,
  deps: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

export const PropsModule = [propsProvider];
