import { createToken, injectable } from '@fridgefm/inverter';
import { context, useAtom } from '@reatom/react';
import React from 'react';
import {
  RENDERER_FN_TOKEN,
  GLOBAL_STORE_TOKEN,
  SCREEN_STORE_TOKEN,
  PROPS_STORE_TOKEN,
  STRUCTURE_STORE_TOKEN,
  FIELD_STORE_TOKEN,
} from './tokens';

import type { Primitive } from '@formula/core-types';
import type {
  ArrayStructVal,
  FieldStructVal,
  GroupStructVal,
  ScreenStructKey,
  FieldStructKey,
} from './structure.types';

const RENDER_ROOT_TOKEN = createToken<React.FC<{}>>('core:render:root');

// @ts-ignore
const defaultWrapper: React.FC = ({ children }) => children;

export const renderProviders = [
  injectable({
    provide: RENDER_ROOT_TOKEN,
    useFactory: (structureStore, fieldStore, screenStore, propsStore) => {
      const RenderVariants = {
        group: ({ children, opts, id }: GroupStructVal) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const childrenRender = children.map((childId) => <RenderVariants.something id={childId} key={childId} />);

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
                data-key={id}
              >
                {childrenRender}
              </div>
            );
          }

          return (
            <div key={id} data-key={id}>
              {childrenRender}
            </div>
          );
        },
        array: ({ children, id }: ArrayStructVal) => {
          const paired = children.reduce((acc, cur) => {
            const innerIndex = Number(cur[cur.length - 2]); // @TODO dirty hack

            if (!acc[innerIndex]) {
              acc[innerIndex] = [];
            }
            acc[innerIndex].push(cur);
            return acc;
          }, [] as FieldStructKey[][]);
          const renderRow = (ids: FieldStructKey[]) =>
            ids.map((childId) => <RenderVariants.something key={childId} id={childId} />);

          return paired.map((ids, index) => {
            const key = `${id}-r${index}`;
            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${paired.length}, 1fr)`,
                  gridGap: '20px',
                }}
                data-key={key}
                key={key}
              >
                {renderRow(ids)}
              </div>
            );
          });
        },
        screen: () => {
          const currentEntities = useAtom(structureStore.atom);
          const currentScreenName = useAtom(screenStore.atom, (a) => `scr.${a.currentScreen}` as ScreenStructKey, []);
          const currentScreen = currentEntities.groups[currentScreenName];

          return (
            <div key={currentScreen.id} data-key={currentScreen.id}>
              {currentScreen.children.map((childId) => (
                <RenderVariants.something key={childId} id={childId} />
              ))}
            </div>
          );
        },
        field: ({ field, id }: FieldStructVal) => {
          const Cmp = field.render;
          const currentProps = useAtom(propsStore.atom, (a) => a[id], []);
          const currentVal = useAtom(fieldStore.atom, (a) => a[id], []);

          const innerProps = {
            setValue: (value: Primitive) => {
              fieldStore.actions.setFieldValue(id, value);
            },
            value: currentVal,
            name: id,
          };

          return <Cmp key={id} data-key={id} {...currentProps} {...innerProps} />;
        },
        something: ({ id }: { id?: string }) => {
          if (!id) {
            return <RenderVariants.screen />;
          }
          const { fields, groups, arrays } = useAtom(structureStore.atom);
          // @ts-ignore
          const foundEntity = { ...fields, ...groups, ...arrays }[id] as FieldStructVal | GroupStructVal;
          if (typeof foundEntity === 'undefined') {
            // eslint-disable-next-line no-console
            console.error(new Error(`Entity with id: ${id} not found`));

            return null;
          }
          if (id.startsWith('fld')) {
            // @ts-ignore
            return <RenderVariants.field {...foundEntity} />;
          }
          if (id.startsWith('grp')) {
            // @ts-ignore
            return <RenderVariants.group {...foundEntity} />;
          }
          if (id.startsWith('arr')) {
            // @ts-ignore
            return <RenderVariants.array {...foundEntity} />;
          }

          return <p>Unknown</p>;
        },
      };

      return RenderVariants.screen;
    },
    inject: [STRUCTURE_STORE_TOKEN, FIELD_STORE_TOKEN, SCREEN_STORE_TOKEN, PROPS_STORE_TOKEN] as const,
  }),
  injectable({
    provide: RENDERER_FN_TOKEN,
    useFactory: (RenderRoot, globalStore) => (Wrapper = defaultWrapper) => () => (
      <context.Provider value={globalStore}>
        <Wrapper>
          <RenderRoot />
        </Wrapper>
      </context.Provider>
    ),
    inject: [RENDER_ROOT_TOKEN, GLOBAL_STORE_TOKEN] as const,
  }),
];
