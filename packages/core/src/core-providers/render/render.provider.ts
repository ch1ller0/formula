import { StructureProvider } from '../index';
import { renderRoot } from './render.util';

import type {
  TProviderConfig,
  TProviderService,
  TProviderConsturctorArgs,
} from '../../types/provider.types';
import { PropsProvider } from '../props/props.provider';
import { FieldProvider } from '../field/field.provider';
import { StepProvider } from '../step/step.provider';

class StructureService implements TProviderService {
  private _args: TProviderConsturctorArgs;

  constructor(args: TProviderConsturctorArgs) {
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
