import styled from 'styled-components';

export const ModuleContainer = styled.div`
  min-height: 100%;
  height: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media screen and (max-width: 900px) {
    min-height: unset;
    height: auto;
  }
`;

export const ModuleHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
`;

export const ModuleHeader = styled.h4`
  color: white;
  display: block;
  text-align: center;

  && {
    font-weight: bold;
  }

  @media screen and (max-width: 900px) {
    text-align: center;
  }
`;

export const ModuleBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 100%;

  @media screen and (max-width: 900px) {
    padding: 0;
    flex: unset;
  }
`;
