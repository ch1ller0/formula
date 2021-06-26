import React from 'react';
import { context, useAtom } from '@reatom/react';
import toPairs from '@tinkoff/utils/object/toPairs';
import prop from '@tinkoff/utils/object/prop';
// import { FieldProvider, StepProvider } from '../index';

import type { TProviderConsturctorArgs } from '../../types/provider.types';
import type { TFieldStructure, TPrimitive } from '../../types/base.types';
import type {
  Group,
  Array,
  StructureInput,
  FormStructure,
} from '../structure/structure.types';

const _exhaustiveCheck = (a: never) => a;
// @ts-ignore
const defaultWrapper: React.FC = ({ children }) => children;

const RenderField: React.FC<{
  field: TFieldStructure['field'];
  args: unknown;
}> = ({ field, args }) => {
  const Cmp = field.render;

  const { propsDeps, fieldDeps, key } = args;
  const currentProps = useAtom(propsDeps.atom, prop(key), []);
  const currentVal = useAtom(fieldDeps.atom, prop(key), []);

  const innerProps = {
    setValue: (value: TPrimitive) => {
      fieldDeps.setValue({ name: key, value });
    },
    value: currentVal,
  };

  return <Cmp key={key} data-key={key} {...currentProps} {...innerProps} />;
};

// const renderArray = ({ array }: Array, args: unknown) => {
//   return <div>renderArray</div>;
// };

const renderGroup = ({ group }: Group, args: any) => {
  const paired = toPairs(group);

  return paired.map((s) => {
    return renderEntity(s[1], { ...args, key: s[0] });
  });
};

const renderEntity = (entity: StructureInput, args: any): React.ReactNode => {
  if ('group' in entity) {
    return renderGroup(entity, args);
  }
  // if ('array' in entity) {
  //   return renderArray(entity, args);
  // }
  if ('field' in entity) {
    return <RenderField {...entity} args={args} key={args.key} />;
  }
  // You are not supposed to be here you know
  // It might indicate that your structure is broken
  _exhaustiveCheck(entity);
  console.error(entity);
  throw new Error('unknown render entity');
};

const RenderTree: React.FC<any> = ({
  structureDeps,
  stepDeps,
  fieldDeps,
  propsDeps,
}) => {
  const currentStructure = useAtom(structureDeps.atom) as FormStructure;
  const currentStep = useAtom(stepDeps.atom, prop('currentStep'), []);

  const res = toPairs(currentStructure);
  // @ts-ignore
  const currentEntity = res[currentStep] as Record<string, StructureInput>;
  const screenKey = `screen-${currentStep}`;
  // console.log('currentEntity', currentEntity);

  return (
    <div key={screenKey} data-key={screenKey}>
      {renderEntity(currentEntity[1], { fieldDeps, propsDeps })}
    </div>
  );
};

export const renderRoot = (
  { globalStore, deps }: TProviderConsturctorArgs<any[]>, // @TODO bad type
  Wrapper = defaultWrapper,
) => {
  const [structureService, propsService, fieldService, stepService] = deps;
  const renderDependencies = {
    structureDeps: structureService._getRenderDeps(),
    propsDeps: propsService._getRenderDeps(),
    fieldDeps: fieldService._getRenderDeps(),
    stepDeps: stepService._getRenderDeps(),
  };
  // console.log('renderDependencies', renderDependencies);

  return () => (
    <context.Provider value={globalStore}>
      <Wrapper>
        <RenderTree {...renderDependencies} />
      </Wrapper>
    </context.Provider>
  );
};
