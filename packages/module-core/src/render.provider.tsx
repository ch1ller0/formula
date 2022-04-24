import { injectable } from '@fridgefm/inverter';
import { context, useAtom } from '@reatom/react';
import React from 'react';
import {
  RENDER_SERVICE_TOKEN,
  STRUCTURE_SERVICE_TOKEN,
  PROPS_SERVICE_TOKEN,
  FIELD_SERVICE_TOKEN,
  SCREEN_SERVICE_TOKEN,
  GLOBAL_STORE_TOKEN,
} from './tokens';

import type { Primitive, TodoAny } from '@formula/core-types';
import type { StructureService, GroupStructVal, ScreenStructKey } from './structure.types';
import type { PropsService } from './props.types';
import type { FieldService } from './field.types';
import type { ScreenService } from './screen.types';

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
  screenDeps: RenderDepReturn<ScreenService>;
  fieldDeps: RenderDepReturn<FieldService>;
  propsDeps: RenderDepReturn<PropsService>;
}> = ({ structureDeps, screenDeps, fieldDeps, propsDeps }) => {
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

  const currentScreen = useAtom(screenDeps.atom, (a) => `scr.${a.currentScreen}` as ScreenStructKey, []);
  const currentEntity = currentEntities.groups[currentScreen] as GroupStructVal;

  return (
    <div key={currentScreen} data-key={currentScreen}>
      {rootRender(currentEntity.id)}
    </div>
  );
};

export const renderProviders = [
  injectable({
    provide: RENDER_SERVICE_TOKEN,
    useFactory: (structureService, propsService, fieldService, screenService, globalStore) => (
      Wrapper = defaultWrapper,
    ) => {
      const renderDependencies = {
        structureDeps: structureService._getRenderDeps(),
        propsDeps: propsService._getRenderDeps(),
        fieldDeps: fieldService._getRenderDeps(),
        screenDeps: screenService._getRenderDeps(),
      };

      return () => (
        <context.Provider value={globalStore}>
          <Wrapper>
            <RenderTree {...renderDependencies} />
          </Wrapper>
        </context.Provider>
      );
    },
    inject: [
      STRUCTURE_SERVICE_TOKEN,
      PROPS_SERVICE_TOKEN,
      FIELD_SERVICE_TOKEN,
      SCREEN_SERVICE_TOKEN,
      GLOBAL_STORE_TOKEN,
    ] as const,
  }),
];
