import React from 'react';
import { context } from '@reatom/react';
import reduce from '@tinkoff/utils/array/reduce';
import { FieldProvider, StepProvider } from '../providers/built-in';
import type { TProviderConfig } from '../types/provider.types';
import type { ProviderContainer } from './provider-container';
import type { TStepStructure } from '../types/base.types';

// @ts-ignore
const defaultWrapper: React.FC = ({ children }) => children;

export type RenderProps = {
  structure: TStepStructure[];
  renderChildren?: (props: RenderProps) => JSX.Element;
};

const ren = (arr: TProviderConfig[], providerContainer: ProviderContainer) =>
  reduce(
    (Resulting, currentProvider) => {
      const Cmp =
        (providerContainer
          .getService(currentProvider)
          .renderWrapper?.() as React.FC<RenderProps>) || defaultWrapper;
      const displayName = `${currentProvider.name}-wrapper`;

      Cmp.displayName = displayName;
      const renderChildren = (props: RenderProps) => <Resulting {...props} />;

      return (props: RenderProps) => {
        const cmp = <Cmp {...props} renderChildren={renderChildren}></Cmp>;
        return process.env.NODE_ENV === 'development' ? (
          <div data-displayname={displayName}>{cmp}</div>
        ) : (
          cmp
        );
      };
    },
    (() => <div>form-entrypoint</div>) as React.FC<RenderProps>,
    arr,
  );

export const renderComponent = (
  providerContainer: ProviderContainer,
  Wrapper = defaultWrapper,
) => {
  const store = providerContainer.getStore();
  const ResultComponent = ren([FieldProvider, StepProvider], providerContainer);
  const props: RenderProps = {
    structure: providerContainer.getConfig().structure,
  };

  return () => (
    <context.Provider value={store}>
      <Wrapper>
        <ResultComponent {...props} />
      </Wrapper>
    </context.Provider>
  );
};
