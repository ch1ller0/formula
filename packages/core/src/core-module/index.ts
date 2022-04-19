import { declareModule } from '@fridgefm/inverter';
import { fieldProviders } from './field/field.provider';
import { stateProviders } from './state/state.module';
import { renderProviders } from './render/render.provider';
import { propsProviders } from './props/props.provider';
import { stepProviders } from './step/step.provider';
import { structureProviders } from './structure/structure.provider';
import { binderProviders } from './binder/binder.provider';

export const CoreModule = declareModule({
  name: 'CoreModule',
  providers: [
    ...fieldProviders,
    ...stateProviders,
    ...renderProviders,
    ...structureProviders,
    ...propsProviders,
    ...stepProviders,
    ...binderProviders,
  ],
});
