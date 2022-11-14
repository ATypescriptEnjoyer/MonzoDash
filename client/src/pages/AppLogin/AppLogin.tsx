import React, { useState, useEffect, useRef } from 'react';
import {
  StyledActionBox,
  StyledContainer,
  StyledSubtitle,
  StyledTitle,
  StyledAuthCodeContainer,
  StyledAuthCodeDigit,
} from './AppLogin.styled';
import { ApiConnector } from '../../network';
import { Button } from '@mui/material';

export const AppLogin = (): JSX.Element => {
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState<{ [indx: number]: number }>({});
  const refs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (Object.values(authCode).join('').length === 6) {
      validateCode();
    }
  }, [authCode]);

  const sendAuthRequest = async (): Promise<void> => {
    await ApiConnector.get('/login/auth-code');
    setAuthCodeSent(true);
  };

  const validateCode = async (): Promise<void> => {
    const connectedCode = Object.values(authCode).join('');
    const { data } = await ApiConnector.post<boolean>('/login/auth-code', { code: connectedCode });
    if (data) {
      localStorage.setItem('auth-code', connectedCode);
      window.location.reload();
    }
  };

  const onDigitChange = (index: number, digit: string): void => {
    digit = digit.substring(digit.length - 1);
    const digitNum = parseInt(digit);
    if (Number.isNaN(digitNum)) {
      return;
    }
    setAuthCode((code) => ({ ...code, [index]: digitNum }));
    if (index < 5) {
      refs.current[index + 1].focus();
    }
  };

  return (
    <StyledContainer>
      <StyledActionBox>
        <StyledTitle>Login Expired</StyledTitle>
        <StyledSubtitle>Please re-authenticate with MonzoDash</StyledSubtitle>
        {authCodeSent && (
          <StyledAuthCodeContainer>
            {Array.from(new Array(6).keys()).map((_, indx) => (
              <StyledAuthCodeDigit
                value={authCode[indx]}
                ref={(el): HTMLElement => (refs.current[indx] = el as HTMLElement)}
                onChange={(event): void => onDigitChange(indx, event.currentTarget.value)}
              />
            ))}
          </StyledAuthCodeContainer>
        )}
        {!authCodeSent && (
          <Button variant="contained" onClick={sendAuthRequest}>
            Send Auth Code via Monzo
          </Button>
        )}
      </StyledActionBox>
    </StyledContainer>
  );
};
