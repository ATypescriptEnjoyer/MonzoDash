import styled from 'styled-components';

export const AppBarIcon = styled.img`
  width: 80px;
  padding-right: 16px;
`;

export const StyledLogoutRounded = styled.span`
  color: ${(props) => props.theme.black};
  background-color: white;
  border-radius: 5px;
  font-size: 2rem;
  cursor: pointer;
  font-weight: bold;
`;

export const StyledHeader = styled.header`
  display: flex;
  padding: 12px 20px;
  height: 95px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.grey};
  width: 100%;
`;

export const Group = styled.div<{ direction?: string; gap?: string }>`
  display: flex;
  gap: ${(props) => props.gap ?? '32px'};
  flex-direction: ${(props) => props.direction ?? 'row'};
  align-items: center;
`;

export const Link = styled.span`
  color: ${(props) => props.theme.lightGrey};
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 2px solid ${(props) => props.theme.lightGrey};
  transition: all 0.25s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.pink};
    border-bottom: 2px solid ${(props) => props.theme.blue};
  }
`;

export const Logo = styled.img`
  width: 50px;
  height: 50px;
`;

export const Splitter = styled.div`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.blue};
  transition: all 0.25s ease-in-out;
`;

export const Tablet = styled.div`
  padding: 8px 24px;
  background-color: ${(props) => props.theme.black};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;

  :hover {
    ${Splitter} {
      border-color: ${(props) => props.theme.pink};
    }
  }
`;

export const TabletItem = styled.div`
  color: ${(props) => props.theme.white};
  font-weight: bold;
`;
