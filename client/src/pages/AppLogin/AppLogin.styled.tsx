import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const StyledActionBox = styled.div`
  max-width: 700px;
  max-height: 600px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const StyledTitle = styled.h1`
  font-size: 3em;
  padding: 0;
  margin: 0 0 12px 0;
`;

export const StyledSubtitle = styled.h3`
  font-size: 1.5em;
  color: #a1a1a1;
  padding: 0;
  margin: 0 0 44px 0;
  text-align: center;
`;

export const StyledAuthCodeContainer = styled.div`
  display: flex;
  gap: 12px;
  @media screen and (max-width: 900px) {
    gap: 4px;
  }
`;

export const StyledAuthCodeDigit = styled.input`
  font-size: 48px;
  font-weight: bold;
  max-width: 56px;
  height: 96px;
  border: 3px solid black;
  border-radius: 6px;
  text-align: center;
  caret-color: transparent;
  box-sizing: border-box;
  flex: 1;

  &:focus {
    outline: none;
    color: #6c9fce;
    border-color: #6c9fce;
  }
`;
