import styled from 'styled-components';

export const ModuleContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModuleHeader = styled.p`
  font-size: 24px;
  line-height: 150%;
  font-weight: bold;
  color: white;

  @media screen and (max-width: 900px) {
    text-align: center;
  }
`;

export const ModuleBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;

  @media screen and (max-width: 900px) {
    padding: 0;
  }
`;
