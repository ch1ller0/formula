import React from 'react';
import { context, useAtom } from '@reatom/react';
import toPairs from '@tinkoff/utils/object/toPairs';

import type { TProviderConsturctorArgs } from '../../types/provider.types';
import type { TFieldStructure, TPrimitive } from '../../types/base.types';
import type {
  GroupOut,
  StructureInput,
  FormStructure,
  TStructureService,
} from '../structure/structure.types';
import type { TPropsService } from '../props/props.types';
import type { TFieldService } from '../field/field.types';
import type { TStepService } from '../step/step.types';

type RenderDepReturn<T extends { _getRenderDeps: any }> = ReturnType<
  T['_getRenderDeps']
>;

const _exhaustiveCheck = (a: never) => a;
// @ts-ignore
const defaultWrapper: React.FC = ({ children }) => children;

const RenderField: React.FC<{
  field: TFieldStructure['field'];
  args: {
    propsDeps: RenderDepReturn<TPropsService>;
    fieldDeps: RenderDepReturn<TFieldService>;
    key: string;
  };
}> = ({ field, args }) => {
  const Cmp = field.render;

  const { propsDeps, fieldDeps, key } = args;
  const currentProps = useAtom(propsDeps.atom, (a) => a[key], []);
  const currentVal = useAtom(fieldDeps.atom, (a) => a[key], []);

  const innerProps = {
    setValue: (value: TPrimitive) => {
      fieldDeps.setValue({ name: key, value });
    },
    value: currentVal,
    name: args.key,
  };

  return <Cmp key={key} data-key={key} {...currentProps} {...innerProps} />;
};

const renderGroup = ({ group, opts }: GroupOut, args: any) => {
  const paired = toPairs(group);
  const children = paired.map((s) =>
    renderEntity(s[1], { ...args, key: s[0] }),
  );

  if (opts.horizontal) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${children.length}, 1fr)`,
          gridGap: '20px',
        }}
        key={args.key}
      >
        {children}
      </div>
    );
  }

  return children;
};

const renderEntity = (entity: StructureInput, args: any): React.ReactNode => {
  if ('group' in entity) {
    return renderGroup(entity, args);
  }

  if ('field' in entity) {
    return <RenderField {...entity} args={args} key={args.key} />;
  }
  // You are not supposed to be here you know
  // It might indicate that your structure is broken
  _exhaustiveCheck(entity);
  console.error(entity);
  throw new Error('unknown render entity');
};

const RenderTree: React.FC<{
  structureDeps: RenderDepReturn<TStructureService>;
  stepDeps: RenderDepReturn<TStepService>;
  fieldDeps: RenderDepReturn<TFieldService>;
  propsDeps: RenderDepReturn<TPropsService>;
}> = ({ structureDeps, stepDeps, fieldDeps, propsDeps }) => {
  const currentStructure = useAtom(structureDeps.atom) as FormStructure;
  const currentStep = useAtom(stepDeps.atom, (a) => a.currentStep, []);

  const res = toPairs(currentStructure);
  // @ts-ignore
  const currentEntity = res[currentStep] as Record<string, StructureInput>;
  const screenKey = `screen-${currentStep}`;

  return (
    <div key={screenKey} data-key={screenKey}>
      {renderEntity(currentEntity[1], {
        fieldDeps,
        propsDeps,
        key: currentEntity[0],
      })}
    </div>
  );
};

export const renderRoot = (
  {
    globalStore,
    deps,
  }: TProviderConsturctorArgs<
    [TStructureService, TPropsService, TFieldService, TStepService]
  >,
  Wrapper = defaultWrapper,
) => {
  const [structureService, propsService, fieldService, stepService] = deps;
  const renderDependencies = {
    structureDeps: structureService._getRenderDeps(),
    propsDeps: propsService._getRenderDeps(),
    fieldDeps: fieldService._getRenderDeps(),
    stepDeps: stepService._getRenderDeps(),
  };

  return () => (
    <context.Provider value={globalStore}>
      <Wrapper>
        <RenderTree {...renderDependencies} />
      </Wrapper>
    </context.Provider>
  );
};
