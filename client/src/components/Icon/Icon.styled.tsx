import styled from 'styled-components';

export const StyledIcon = styled.span<{ clickable?: boolean; hidden?: boolean }>`
  background-color: ${(props) => props.theme.grey};
  color: ${(props) => props.theme.lightGrey};
  border-radius: 50%;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  font-size: 1.5rem;
  padding: 10px;
  transition: all 0.25s ease-in-out;
  width: 44px;
  height: 44px;
  box-sizing: border-box;
  user-select: none;
  visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};

  ${(props) =>
    props.clickable &&
    `
    :hover {
      visibility: ${props.hidden ? 'hidden' : 'visible'};
      color: ${props.theme.white};
      background-color: ${props.theme.pink};
    }
  `};
`;
