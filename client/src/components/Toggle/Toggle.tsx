import React from 'react';
import { StyledToggle, ToggleInner } from './Toggle.styled';

interface Props {
  onChange: (val: boolean) => void;
  value: boolean;
}

export const Toggle = (props: Props) => {
  return (
    <StyledToggle $status={props.value} onClick={() => props.onChange(!props.value)}>
      <ToggleInner $status={props.value} />
    </StyledToggle>
  );
};
