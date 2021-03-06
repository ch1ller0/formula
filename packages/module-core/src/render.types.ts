import type React from 'react';

export type RendererFn = (Wrapper?: React.FC) => () => JSX.Element;
