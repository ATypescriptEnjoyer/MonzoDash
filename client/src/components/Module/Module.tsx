import React from 'react';
import { ModuleContainer, ModuleHeaderContainer, ModuleHeader, ModuleBody } from './Module.styled';
import { Button } from '@mui/material';

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
        <ModuleHeader variant="h4">{HeaderText}</ModuleHeader>
        {onEditClick && !isEditing && (
          <Button variant="contained" onClick={handleEditingButtonsClicked}>
            Edit
          </Button>
        )}
        {onEditCancelClick && isEditing && (
          <Button variant="contained" onClick={handleEditingButtonsClicked}>
            Cancel
          </Button>
        )}
      </ModuleHeaderContainer>
      <ModuleBody>{children}</ModuleBody>
    </ModuleContainer>
  );
};
