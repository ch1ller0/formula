import React from 'react';
import { Canvas } from 'reaflow';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const render = () => {
  const providers = useParameter('providers', []);

  if (!providers.length) {
    return <p>Empty providers tree</p>
  }

  const edges = providers.reduce((acc, cur) => {
      const {deps, provide} = cur
      if (deps.length) {
        deps.forEach(dep => {
          acc.push({
            id: `${provide}->${dep}`,
            from: provide,
            to: dep
          })
        });
      }

      return acc
    }, [])

  return <Canvas
    fit={true}
    readonly={true}
    nodes={providers.map(({ provide }) => ({ id: provide, text: provide }))}
    direction="UP"
    edges={edges}
  />
}

addons.register('formula-addon', () => {
  addons.add('formula-providers/tab', {
    title: 'Dep Tree',
    // 👇 Sets the type of UI element in Storybook
    type: types.TAB,
    route: ({ storyId, refId }) => (refId ? `/dependencies/${refId}_${storyId}` : `/dependencies/${storyId}`),
    match: ({ viewMode }) => !!viewMode,
    render,
  });
});
