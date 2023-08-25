import { styled } from "styled-components";

export const IconButton = styled.button<{ mode: "LIGHT" | "DARK" }>`
  display: flex;
  width: 120px;
  height: 40px;
  background-color: ${(props) =>
    props.mode === "LIGHT"
      ? props.theme.colors.freezePurple
      : props.theme.colors.heavyPurple};
  border-radius: 10px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
  outline: none;
  border: none;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.mode === "LIGHT"
      ? props.theme.colors.heavyPurple
      : props.theme.colors.freezePurple};
  font-weight: Bold;
  text-decoration: none;

  // 아이콘과 텍스트 사이의 간격
  & > *:nth-child(even) {
    margin-left: 4px;
  }
`;

export const TextButton = styled.button<{ mode: "LIGHT" | "DARK" }>`
  width: max-content;
  height: min-content;
  background: none;
  outline: none;
  border: none;
  color: ${(props) =>
    props.mode === "LIGHT"
      ? props.theme.colors.freezePurple
      : props.theme.colors.heavyPurple};
  font-size: 12px;
  font-weight: Regular;
  text-decoration: underline;
`;
