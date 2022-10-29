import React from 'react';
import { ModuleContainer, ModuleHeader, ModuleBody } from './Module.styled';

interface Props {
  children?: React.ReactNode;
  HeaderText?: string;
  horizontalSpace?: number;
  verticalSpace?: number;
}

export const Module = ({ HeaderText, children, horizontalSpace = 1, verticalSpace = 1 }: Props): JSX.Element => {
  return (
    <ModuleContainer style={{ gridColumn: `span ${horizontalSpace}`, gridRow: `span ${verticalSpace}` }}>
      <ModuleHeader variant="h4">{HeaderText}</ModuleHeader>
      <ModuleBody>{children}</ModuleBody>
    </ModuleContainer>
  );
};
