import React from 'react';
import { Panel } from 'rsuite';

export const boxWrapper: React.FC = ({ children }) => {
  return (
    <Panel
      shaded
      style={{
        minHeight: 250,
      }}
    >
      <form>{children}</form>
    </Panel>
  );
};
