import styled from 'styled-components';

export const StyledHeader = styled.div`
  background-color: white;
  border-radius: 6px;
  height: 75px;
  box-sizing: border-box;
  padding: 16px;
  gap: 16px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
`;

export const StyledIcon = styled.img`
  border-radius: 6px;
  width: 48px;
  height: 48px;
`;

export const StyledMerchant = styled.h4`
  color: ${(props) => props.theme.black};
  padding: 0;
  margin: 0;
`;

export const StyledInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: center;
`;

export const StyledCurrency = styled.span<{ Type: 'incoming' | 'outgoing' }>`
  font-weight: bold;
  color: ${({ Type }): string => (Type === 'incoming' ? '#80d195' : 'black')};
  ::before {
    content: '${({ Type }): string => (Type === 'incoming' ? '+' : '-')} £';
  }
`;
