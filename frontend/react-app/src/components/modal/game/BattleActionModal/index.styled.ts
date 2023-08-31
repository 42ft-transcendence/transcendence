import { styled } from "styled-components";
import Lock from "@assets/icons/LockKey.svg";

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: fixed; /* 화면에 고정 */
  top: 50%; /* 화면의 중앙에 위치시킴 */
  left: 50%; /* 화면의 중앙에 위치시킴 */
  transform: translate(-50%, -50%); /* 화면의 정확한 중앙에 배치 */

  z-index: 301; /* 다른 요소 위에 오도록 z-index를 높게 설정 */
  background-color: rgba(0, 0, 0, 0); /* 반투명한 배경 */
  width: 100vw; /* 화면의 너비 전체 */
  height: 100vh; /* 화면의 높이 전체 */
`;

export const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 중앙 정렬
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
  border: 1px solid ${(props) => props.theme.colors.freezePurple};
  border-radius: 30px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
`;

export const Title = styled.h2`
  max-width: 450px;
  margin: 0 0 20px;
  color: ${(props) => props.theme.colors.freezePurple};
  font-size: 32px;
  font-weight: Bold;
`;

export const PasswordInput = styled.input`
  width: 150px;
  height: 24px;
  background: none;
  background-image: url(${Lock});
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: right;
  padding-right: 24px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.freezePurple};
  outline: none;
  color: ${(props) => props.theme.colors.freezePurple};
  font-size: 20px;
  font-weight: Regular;
  line-height: 40px;
  text-align: center;
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;
