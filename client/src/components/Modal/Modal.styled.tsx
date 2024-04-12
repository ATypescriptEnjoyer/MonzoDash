import styled from 'styled-components';

export const BackContainer = styled.div<{ $show: boolean }>`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  width: 100%;
  height: 70%;
  background-color: ${(props) => props.theme.black};
  border: 2px solid ${(props) => props.theme.pink};
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    height: 100%;
    border: 0;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.blue};
  box-sizing: border-box;
`;

export const Title = styled.h1``;

export const Body = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
