import { FieldModule } from './field/field.module';
import { StateModule } from './state/state.module';
import { PropsModule } from './props/props.module';
import { RenderModule } from './render/render.module';
import { StepModule } from './step/step.module';
import { StructureModule } from './structure/structure.module';
import { BinderModule } from './binder/binder.module';

export const CoreModule = [
  ...StructureModule,
  ...RenderModule,
  ...PropsModule,
  ...BinderModule,
  ...FieldModule,
  ...StepModule,
  ...StateModule,
];
