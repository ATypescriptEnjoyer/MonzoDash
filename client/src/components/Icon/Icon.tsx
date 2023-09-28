import React, { ReactHTMLElement } from 'react';
import { StyledIcon } from './Icon.styled';

interface Props {
  icon: string;
  disabled?: boolean;
  hidden?: boolean;
}

type IconProps = Props & React.HTMLAttributes<HTMLSpanElement>;

export const Icon = ({ icon, onClick, disabled, hidden, ...rest }: IconProps) => {
  return (
    <StyledIcon
      clickable={!!onClick && !disabled}
      onClick={(ev) => !disabled && onClick && onClick(ev)}
      className="material-symbols-outlined"
      hidden={hidden}
      {...rest}
    >
      {icon}
    </StyledIcon>
  );
};
