import React from 'react';
import { context, useAtom } from '@reatom/react';

import type { Primitive } from '../../types/base.types';
import type { StructureService, GroupStructVal, ScreenStructKey } from '../structure/structure.types';
import type { PropsService } from '../props/props.types';
import type { FieldService } from '../field/field.types';
import type { StepService } from '../step/step.types';
import type { GlobalStore } from '../state/state.types';
import type { RendererFn } from './render.types';
import type { TodoAny } from '@formula/core-types';

type RenderDepReturn<T extends { _getRenderDeps: TodoAny }> = ReturnType<T['_getRenderDeps']>;

const createRenderers = (
  // @ts-ignore
  resolveEnt,
  args: {
    propsDeps: RenderDepReturn<PropsService>;
    fieldDeps: RenderDepReturn<FieldService>;
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
      setValue: (value: Primitive) => {
        fieldDeps.setValue({ name: id, value });
      },
      value: currentVal,
      name: id,
    };

    return <Cmp key={id} data-key={id} {...currentProps} {...innerProps} />;
  };

  const renderGroup = ({ children, opts, id }: GroupStructVal) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const childrenRender = children.map((a) => renderUnknown(a));

    if (opts.invisible === true) {
      return null;
    }

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

    return childrenRender;
  };

  const renderUnknown = (id: string): React.ReactNode => {
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
    // eslint-disable-next-line no-console
    console.error(entity);
    throw new Error('unknown render entity');
  };

  return renderUnknown;
};

// const _exhaustiveCheck = (a: never) => a;
// @ts-ignore
const defaultWrapper: React.FC = ({ children }) => children;

const RenderTree: React.FC<{
  structureDeps: RenderDepReturn<StructureService>;
  stepDeps: RenderDepReturn<StepService>;
  fieldDeps: RenderDepReturn<FieldService>;
  propsDeps: RenderDepReturn<PropsService>;
}> = ({ structureDeps, stepDeps, fieldDeps, propsDeps }) => {
  const currentEntities = useAtom(structureDeps.atom);

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

  const currentScreen = useAtom(stepDeps.atom, (a) => `scr.${a.currentStep}` as ScreenStructKey, []);
  const currentEntity = currentEntities.groups[currentScreen] as GroupStructVal;

  return (
    <div key={currentScreen} data-key={currentScreen}>
      {rootRender(currentEntity.id)}
    </div>
  );
};

export const renderRoot = (
  deps: [StructureService, PropsService, FieldService, StepService, GlobalStore],
): RendererFn => (Wrapper = defaultWrapper) => {
  const [structureService, propsService, fieldService, stepService, globalStore] = deps;
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
