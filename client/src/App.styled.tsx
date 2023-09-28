import styled from 'styled-components';

export const StyledApp = styled.div`
  background: ${(props) => props.theme.black};
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
`;
