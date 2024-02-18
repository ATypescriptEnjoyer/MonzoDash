import styled from 'styled-components';

export const StyledSpendingBox = styled.div<{ $borderColor: string }>`
  border: 2px solid ${(props) => props.$borderColor};
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px;
`;

export const Title = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  grid-column: span 3;
`;

export const Option = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
`;

export const Header = styled.div`
  text-align: center;
`;

export const Value = styled.input`
  width: 100%;
  border: 0;
  height: 27px;
  padding: 0;
  background: ${(props) => props.theme.grey};
  color: ${(props) => props.theme.white};
  text-align: center;
`;
