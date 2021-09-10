import { Subject } from 'rxjs';
import { FIELD_SERVICE_TOKEN, STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN } from '../tokens';
import { useState } from './field.state';
import type { ExtractToken, Provider } from '@formula/ioc';
import type { TFieldService, ChangeKeyValArgs } from './field.types';

const fieldFactory = (
  deps: [ExtractToken<typeof STRUCTURE_SERVICE_TOKEN>, ExtractToken<typeof GLOBAL_STORE_TOKEN>],
) => {
  const [structureService, globalStore] = deps;
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

const fieldProvider: Provider<TFieldService> = {
  provide: FIELD_SERVICE_TOKEN,
  useFactory: fieldFactory,
  deps: [STRUCTURE_SERVICE_TOKEN, GLOBAL_STORE_TOKEN],
};

export const FieldModule = [fieldProvider];
