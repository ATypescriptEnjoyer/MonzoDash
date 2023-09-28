import React, { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './Button.styled';

export const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
