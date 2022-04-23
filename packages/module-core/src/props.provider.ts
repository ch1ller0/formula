import { injectable } from '@fridgefm/inverter';
import { STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN, PROPS_SERVICE_TOKEN } from './tokens';
import { useState } from './props.state';
import type { Props } from './props.types';

export const propsProviders = [
  injectable({
    provide: PROPS_SERVICE_TOKEN,
    useFactory: (structureService, globalStore) => {
      const structure = structureService._getInitialState();
      const selfState = useState({ globalStore, structure });

      return {
        setFieldProp: (name: string, value: Props) => {
          selfState.actions.changeFieldProps({ name, value });
        },
        _getRenderDeps: () => ({ atom: selfState._atom }),
      };
    },
    inject: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];
