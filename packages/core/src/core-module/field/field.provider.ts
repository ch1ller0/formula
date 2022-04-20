import { Subject } from 'rxjs';
import { injectable } from '@fridgefm/inverter';
import { FIELD_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from '../tokens';
import { useState } from './field.state';
import type { TokenProvide } from '@fridgefm/inverter';
import type { ChangeKeyValArgs } from './field.types';

const fieldFactory = (
  structureService: TokenProvide<typeof STRUCTURE_SERVICE_TOKEN>,
  globalStore: TokenProvide<typeof GLOBAL_STORE_TOKEN>,
) => {
  const structure = structureService._getInitialState();
  const selfState = useState({ globalStore, structure });
  const diffStream = new Subject<ChangeKeyValArgs>();

  return {
    getRxStore: () => selfState.rx,
    getDiffRx: () => diffStream.asObservable(),
    _getRenderDeps: () => ({
      atom: selfState._atom,
      setValue: (args: ChangeKeyValArgs) => {
        diffStream.next(args); // Also send observable for click
        if (args.value !== null) {
          selfState.actions.changeKeyVal(args);
        }
      },
    }),
  };
};

export const fieldProviders = [
  injectable({
    provide: FIELD_SERVICE_TOKEN,
    useFactory: fieldFactory,
    inject: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];
