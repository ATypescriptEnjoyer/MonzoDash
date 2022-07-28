import React from 'react';
import { ModuleContainer, ModuleHeader, ModuleBody } from './Module.styled';

interface Props {
  children?: React.ReactNode;
  HeaderText: string;
}

export const Module = ({ HeaderText, children }: Props): JSX.Element => {
  return (
    <ModuleContainer>
      <ModuleHeader>{HeaderText}</ModuleHeader>
      <ModuleBody>{children}</ModuleBody>
    </ModuleContainer>
  );
};
