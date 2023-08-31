import { styled } from "styled-components";

export const SortContainer = styled.div<{ mode: string }>`
  position: relative; /* 추가 */
  width: 120px;
  height: 60px;
  margin-left: 30px;
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.mode === "DARK"
      ? props.theme.colors.freezePurple
      : props.theme.colors.heavyPurple};
`;

export const SortArrowIcon = styled.span<{ mode: string; $isOpen: boolean }>`
  transform: translate(-50%, -50%)
    rotate(${(props) => (props.$isOpen ? "-90deg" : "90deg")});
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid
    ${(props) =>
      props.mode === "DARK"
        ? props.theme.colors.freezePurple
        : props.theme.colors.heavyPurple}; /* Adjust the size of the triangle */
  margin-top: 10px;
  margin-left: 15px;
  cursor: pointer;
`;

export const SortDropdown = styled.div<{ mode: string }>`
  position: absolute;
  top: 50px; /* SortContainer의 높이 + 약간의 간격 */
  left: -12px;
  width: 180px; /* 필요한 경우 크기 조절 */
  background-color: ${(props) =>
    props.mode === "DARK"
      ? props.theme.colors.heavyPurple
      : props.theme.colors.freezePurple};
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 10; /* 다른 요소 위에 올라오도록 함 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;

export const SortOption = styled.button<{ mode: string }>`
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  color: ${(props) =>
    props.mode === "DARK"
      ? props.theme.colors.freezePurple
      : props.theme.colors.heavyPurple};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1); /* 마우스 오버 효과 */
  }
`;
