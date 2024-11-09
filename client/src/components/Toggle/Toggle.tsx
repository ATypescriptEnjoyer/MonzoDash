import { StyledToggle, ToggleInner } from './Toggle.styled';

interface Props {
  onChange: (val: boolean) => void;
  value: boolean;
  disabled?: boolean;
}

export const Toggle = (props: Props) => {
  return (
    <StyledToggle $status={props.value} onClick={() => (props.disabled ? null : props.onChange(!props.value))}>
      {!props.disabled && <ToggleInner $status={props.value} />}
    </StyledToggle>
  );
};
