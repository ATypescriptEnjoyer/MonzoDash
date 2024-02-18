import styled from 'styled-components';

export const StyledToggle = styled.div<{ $status: boolean }>`
  width: 50px;
  height: 25px;
  border: 2px solid ${(props) => props.theme.white};
  border-radius: 60px;
  background-color: ${(props) => (props.$status ? props.theme.pink : props.theme.grey)};
  transition: all 0.25s ease-in-out;
  display: flex;
  position: relative;
  margin: 0 auto;
`;

export const ToggleInner = styled.div<{ $status: boolean }>`
  position: absolute;
  top: 0;
  left: ${(props) => (props.$status ? '50%' : '0%')};
  transition: all 0.25s ease-in-out;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.black};
  border-radius: 30px;
`;
