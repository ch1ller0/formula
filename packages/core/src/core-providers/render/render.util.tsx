import React from 'react';
import { context, useAtom } from '@reatom/react';

import type { TProviderConsturctorArgs } from '../../types/provider.types';
import type { TPrimitive } from '../../types/base.types';
import type {
  TStructureService,
  GroupStructVal,
} from '../structure/structure.types';
import type { TPropsService } from '../props/props.types';
import type { TFieldService } from '../field/field.types';
import type { TStepService } from '../step/step.types';

type RenderDepReturn<T extends { _getRenderDeps: any }> = ReturnType<
  T['_getRenderDeps']
>;

const createRenderers = (
  resolveEnt,
  args: {
    propsDeps: RenderDepReturn<TPropsService>;
    fieldDeps: RenderDepReturn<TFieldService>;
  },
) => {
  const { propsDeps, fieldDeps } = args;

  const RenderField: React.FC<{
    id: string;
  }> = ({ id }) => {
    const ent = resolveEnt(id);
    const Cmp = ent.field.render;
    const currentProps = useAtom(propsDeps.atom, (a) => a[id], []);
    const currentVal = useAtom(fieldDeps.atom, (a) => a[id], []);

    const innerProps = {
      setValue: (value: TPrimitive) => {
        fieldDeps.setValue({ name: id, value });
      },
      value: currentVal,
      name: id,
    };

    return <Cmp key={id} data-key={id} {...currentProps} {...innerProps} />;
  };

  const renderGroup = ({ children, opts, id }: GroupStructVal) => {
    const childrenRender = children.map((a) => renderAny(a));

    if (opts.horizontal) {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${children.length}, 1fr)`,
            gridGap: '20px',
          }}
          key={id}
        >
          {childrenRender}
        </div>
      );
    }

    if (opts.visible === false) {
      return null;
    }

    return childrenRender;
  };

  const renderAny = (id: string): React.ReactNode => {
    const entity = resolveEnt(id);
    if (entity.id.includes('scr') || entity.id.includes('grp')) {
      return renderGroup(entity);
    }

    if (entity.id.includes('fld')) {
      return <RenderField {...entity} key={id} />;
    }
    // You are not supposed to be here you know
    // It might indicate that your structure is broken
    // _exhaustiveCheck(entity);
    console.error(entity);
    throw new Error('unknown render entity');
  };

  return renderAny;
};

const _exhaustiveCheck = (a: never) => a;
// @ts-ignore
const defaultWrapper: React.FC = ({ children }) => children;

const RenderTree: React.FC<{
  structureDeps: RenderDepReturn<TStructureService>;
  stepDeps: RenderDepReturn<TStepService>;
  fieldDeps: RenderDepReturn<TFieldService>;
  propsDeps: RenderDepReturn<TPropsService>;
}> = ({ structureDeps, stepDeps, fieldDeps, propsDeps }) => {
  const rootRender = createRenderers(
    (key: string) => {
      const { fields, groups } = currentEntities;
      return { ...fields, ...groups }[key];
    },
    {
      fieldDeps,
      propsDeps,
    },
  );

  const currentEntities = useAtom(structureDeps.atom);
  const currentScreen = useAtom(
    stepDeps.atom,
    (a) => `scr.${a.currentStep}`,
    [],
  );
  // @ts-ignore
  const currentEntity = currentEntities.groups[currentScreen] as GroupStructVal;

  return (
    <div key={currentScreen} data-key={currentScreen}>
      {rootRender(currentEntity.id)}
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
