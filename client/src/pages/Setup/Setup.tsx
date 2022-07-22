import React, { useEffect, useState } from 'react';
import { StyledActionBox, StyledContainer, StyledSubtitle, StyledTitle, StyledButton } from './Setup.styled';
import { ApiConnector } from '../../network';

export const Setup = (): JSX.Element => {
  const [monzoUrl, setMonzoUrl] = useState('');

  useEffect(() => {
    const getMonzoUrl = async (): Promise<void> => {
      const { data: urlString } = await ApiConnector.get<string>('/auth/redirectUri');
      setMonzoUrl(urlString);
    };
    getMonzoUrl();
  }, []);

  const handleMonzoLogin = (): void => {
    window.location.href = monzoUrl;
  };

  return (
    <StyledContainer>
      <StyledActionBox>
        <StyledTitle>MonzoDash</StyledTitle>
        <StyledSubtitle>The Ultimate Monzo Web Dashboard</StyledSubtitle>
        <StyledButton disabled={!monzoUrl} variant="contained" onClick={handleMonzoLogin}>
          Login With Monzo
        </StyledButton>
      </StyledActionBox>
    </StyledContainer>
  );
};
