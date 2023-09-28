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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AppLogin = (): JSX.Element => {
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState<{ [indx: number]: number | string }>({});
  const refs = useRef<HTMLElement[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const defaultValues = Array.from(new Array(6).keys()).reduce((prev, _, indx) => {
      prev = { ...prev, [indx]: '' };
      return prev;
    }, {});
    setAuthCode(defaultValues);
  }, []);

  useEffect(() => {
    const validateCode = async (): Promise<void> => {
      const connectedCode = Object.values(authCode).join('');
      const { data } = await ApiConnector.post<boolean>('/login/auth-code', { code: connectedCode });
      if (data) {
        localStorage.setItem('auth-code', connectedCode);
        window.location.reload();
      }
    };

    if (Object.values(authCode).join('').length === 6) {
      validateCode();
    }
  }, [authCode]);

  const sendAuthRequest = async (): Promise<void> => {
    try {
      await ApiConnector.get('/login/auth-code');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          await ApiConnector.post('/auth/signout').finally(() => navigate('/login'));
        }
      }
    }
    setAuthCodeSent(true);
  };

  const onDigitChange = (index: number, digit: number): void => {
    setAuthCode((code) => ({ ...code, [index]: digit }));
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
                key={indx}
                type="number"
                value={authCode[indx]}
                ref={(el): HTMLElement => (refs.current[indx] = el as HTMLElement)}
                onChange={(event): void => onDigitChange(indx, event.currentTarget.valueAsNumber)}
              />
            ))}
          </StyledAuthCodeContainer>
        )}
        {!authCodeSent && <button onClick={sendAuthRequest}>Send Auth Code via Monzo</button>}
      </StyledActionBox>
    </StyledContainer>
  );
};
