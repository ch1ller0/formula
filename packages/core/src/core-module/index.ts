import { fieldProvider } from './field/field.provider';
import { globalStoreProvider } from './global-store/global-store.provider';
import { propsProvider } from './props/props.provider';
import { renderProvider } from './render/render.provider';
import { stepProvider } from './step/step.provider';
import { structureProvider } from './structure/structure.provider';
import { binderProvider } from './binder/binder.provider';

export const coreProviders = [
  binderProvider,
  fieldProvider,
  globalStoreProvider,
  propsProvider,
  renderProvider,
  stepProvider,
  structureProvider,
];
