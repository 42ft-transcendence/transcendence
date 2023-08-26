import { styled } from "styled-components";

export const TextBox = styled.div`
  display: flex;
  width: 80%;
  height: 30px;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.freezePurple};
`;
