import styled from 'styled-components';

export const StyledButton = styled.button`
  border: 2px solid ${(props) => props.theme.pink};
  background-color: ${(props) => props.theme.black};
  color: ${(props) => props.theme.white};
  padding: 16px 56px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  font-size: 16px;
  font-weight: bold;

  :hover {
    border-color: ${(props) => props.theme.blue};
  }

  :disabled {
    border-color: ${(props) => props.theme.grey};
    color: ${(props) => props.theme.grey};
    cursor: not-allowed;
  }
`;
