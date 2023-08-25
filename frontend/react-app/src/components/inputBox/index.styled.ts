import { Theme } from "@src/styles/Theme";
import { styled } from "styled-components";

export const InputBoxWrapper = styled.input`
  width: 200px;
  height: 52px;
  outline: none;
  font-size: 20px;
  background: none;
  text-align: center;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid ${Theme.colors.freezePurple};
  color: ${Theme.colors.freezePurple};
  margin-top: 50px;
`;
