import styled from 'styled-components';
import { Icon } from '../Icon';

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

export const StyledHeader = styled.header<{ $visible: boolean }>`
  display: flex;
  padding: 12px 20px;
  height: 95px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.grey};
  width: 100%;

  @media (max-width: 600px) {
    width: 0px;
    display: none;
    ${({ $visible, ...props }) => $visible && `
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 99;
      background-color: ${props.theme.black};
      height: 100%;
      justify-content: initial;
      align-items: initial;
    `};
  }
`;

export const Group = styled.div<{ $direction?: string; $gap?: string }>`
  display: flex;
  gap: ${(props) => props.$gap ?? '32px'};
  align-items: center;

  @media (max-width: 600px) {
    margin-top: 16px;
    flex-direction: ${(props) => props.$direction ?? 'column'};
    justify-content: space-between;
    padding: 0 24px;
  }
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

export const Tablet = styled.div<{ $isMobile?: boolean }>`
  padding: 8px 24px;
  display: ${(props) => props.$isMobile ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;

  :hover {
    ${Splitter} {
      border-color: ${(props) => props.theme.pink};
    }
  }

  @media (max-width: 600px) {
    display: ${(props) => props.$isMobile ? 'flex' : 'none'};
  }
`;

export const TabletItem = styled.div`
  color: ${(props) => props.theme.white};
  font-weight: bold;
`;

export const MobileOnlyIcon = styled(Icon)`
display: none;
@media (max-width: 600px) {
  display: block;
}
`;

export const DesktopOnlyIcon = styled(Icon)`
display: none;
@media (min-width: 600px) {
  display: block;
}
`;

export const MobileGroup = styled(Group)`
display: none;
@media (max-width: 600px) {
  display: flex;
}
`;