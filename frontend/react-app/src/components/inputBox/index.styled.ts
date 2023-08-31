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

  /* 자동 완성 배경색 및 폰트 스타일 제어 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: ${(props) =>
      props.theme.colors.freezePurple}; /* 텍스트 색상 */
    font-size: 20px; /* 폰트 크기 */
    font-family: inter; /* 폰트 종류 */
    font-weight: bold; /* 폰트 두께 */
  }
`;
