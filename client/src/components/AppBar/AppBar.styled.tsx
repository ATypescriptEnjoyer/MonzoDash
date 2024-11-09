import { styled } from '@mui/material/styles';
import { Icon } from '../Icon';
import { colours } from '../../theme';

export const AppBarIcon = styled('img')`
  width: 80px;
  padding-right: 16px;
`;

export const StyledLogoutRounded = styled('span')`
  color: ${colours.black};
  background-color: white;
  border-radius: 5px;
  font-size: 2rem;
  cursor: pointer;
  font-weight: bold;
`;

export const Link = styled('span')`
  color: ${colours.lightGrey};
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 2px solid ${colours.lightGrey};
  transition: all 0.25s ease-in-out;

  &:hover {
    color: ${colours.pink};
    border-bottom: 2px solid ${colours.blue};
  }
`;

export const Logo = styled('img')`
  width: 50px;
  height: 50px;
`;

export const Splitter = styled('div')`
  width: 100%;
  border-bottom: 1px solid ${colours.blue};
  transition: all 0.25s ease-in-out;
`;

export const Tablet = styled('div')`
  padding: 8px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;

  :hover {
    ${Splitter} {
      border-color: ${colours.pink};
    }
  }
`;

export const TabletItem = styled('div')`
  color: ${colours.white};
  font-weight: bold;
  text-align: center;
`;

export const DesktopOnlyIcon = styled(Icon)`
  display: none;
  @media (min-width: 600px) {
    display: block;
  }
`;
