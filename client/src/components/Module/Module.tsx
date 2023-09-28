import React from 'react';
import { ModuleContainer, ModuleHeaderContainer, ModuleHeader, ModuleBody } from './Module.styled';

interface Props {
  children?: React.ReactNode;
  HeaderText?: string;
  horizontalSpace?: number;
  verticalSpace?: number;
  isEditing?: boolean;
  onEditClick?: () => void;
  onEditCancelClick?: () => void;
}

export const Module = ({
  HeaderText,
  children,
  horizontalSpace = 1,
  verticalSpace = 1,
  isEditing,
  onEditClick,
  onEditCancelClick,
}: Props): JSX.Element => {
  const handleEditingButtonsClicked = () => {
    if (isEditing) {
      onEditCancelClick && onEditCancelClick();
    } else {
      onEditClick && onEditClick();
    }
  };

  return (
    <ModuleContainer style={{ gridColumn: `span ${horizontalSpace}`, gridRow: `span ${verticalSpace}` }}>
      <ModuleHeaderContainer>
        {(onEditClick || onEditCancelClick) && <span></span>}
        <ModuleHeader>{HeaderText}</ModuleHeader>
        {onEditClick && !isEditing && <button onClick={handleEditingButtonsClicked}>Edit</button>}
        {onEditCancelClick && isEditing && <button onClick={handleEditingButtonsClicked}>Cancel</button>}
      </ModuleHeaderContainer>
      <ModuleBody>{children}</ModuleBody>
    </ModuleContainer>
  );
};
