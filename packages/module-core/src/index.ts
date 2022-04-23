import { declareModule } from '@fridgefm/inverter';
import { fieldProviders } from './field.provider';
import { stateProviders } from './state.provider';
import { renderProviders } from './render.provider';
import { propsProviders } from './props.provider';
import { stepProviders } from './step.provider';
import { structureProviders } from './structure.provider';
import { binderProviders } from './binder.provider';

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

export * as CoreTokens from './tokens';
