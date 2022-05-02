import React, { useEffect } from 'react';
import { StyledActionBox, StyledContainer, StyledSubtitle, StyledTitle } from './TwoFactor.styled';
import { ApiConnector } from '../../network';

export const TwoFactor = (): JSX.Element => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await ApiConnector.get<boolean>('/auth/checkTwoFactor');
      if (data) {
        window.location.href = '/app/dashboard';
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledContainer>
      <StyledActionBox>
        <StyledTitle>2FA Required</StyledTitle>
        <StyledSubtitle>Check your Monzo app to verify the login!</StyledSubtitle>
      </StyledActionBox>
    </StyledContainer>
  );
};
