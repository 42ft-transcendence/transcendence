import { styled } from "styled-components";

import Lock from "@assets/LockKey.svg";

export const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  background: none;
  z-index: 1;
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
  z-index: 2;
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
