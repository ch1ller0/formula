import { renderRoot } from './render.util';
import {
  StructureProvider,
  PropsProvider,
  FieldProvider,
  StepProvider,
  TStructureService,
  TPropsService,
  TFieldService,
  TStepService,
} from '../index';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../types/provider.types';

class StructureService implements TProviderService {
  private _args: TProviderConsturctorArgs<
    [TStructureService, TPropsService, TFieldService, TStepService]
  >;

  constructor(
    args: TProviderConsturctorArgs<
      [TStructureService, TPropsService, TFieldService, TStepService]
    >,
  ) {
    this._args = args;
  }

  renderRoot(CoreWrapper?: React.FC) {
    return renderRoot(this._args, CoreWrapper);
  }

  useBinders() {
    return {};
  }
}

export const RenderProvider: TProviderConfig<StructureService> = {
  name: 'render',
  useService: StructureService,
  deps: [StructureProvider, PropsProvider, FieldProvider, StepProvider],
};
