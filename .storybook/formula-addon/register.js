import React from 'react';
import { Canvas, Node } from 'reaflow';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const generateBackgrounds = (providers) => {
  const generateRandomColor = () => {
    const letters = '0123456789AB';
    let color = '#';
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * (letters.length - 1))];
    }
    return color;
  }

  const backs = { core: 'black', kernel: 'black' }

  providers.forEach(x => {
    const key = x.provide.split(':')[0]
    if (backs[key]) {
      return 
    }
    backs[key] = generateRandomColor()
  })

  return backs
}

const render = () => {
  const providers = useParameter('providers', []);

  if (!providers.length) {
    return <p>Empty providers tree</p>
  }

  const HIGHLIGHTS = generateBackgrounds(providers)

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
    node={(node) => {
      const fill = HIGHLIGHTS[node.id.split(':')[0]]
      return <Node
          {...node}
          style={{ fill }}
        />
      }
    }
  />
}

// addons.register('formula-addon', () => {
//   addons.add('formula-providers/tab', {
//     title: 'Dep Tree',
//     // 👇 Sets the type of UI element in Storybook
//     type: types.TAB,
//     route: ({ storyId, refId }) => (refId ? `/dependencies/${refId}_${storyId}` : `/dependencies/${storyId}`),
//     match: ({ viewMode }) => !!viewMode,
//     render,
//   });
// });
