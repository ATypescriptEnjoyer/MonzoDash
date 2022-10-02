import React from 'react';
import { ModuleContainer, ModuleHeader, ModuleBody } from './Module.styled';

interface Props {
  children?: React.ReactNode;
  HeaderText?: string;
  space?: number;
}

export const Module = ({ HeaderText, children, space = 1 }: Props): JSX.Element => {
  return (
    <ModuleContainer style={{ gridColumn: `span ${space}` }}>
      <ModuleHeader variant="h4">{HeaderText}</ModuleHeader>
      <ModuleBody>{children}</ModuleBody>
    </ModuleContainer>
  );
};
