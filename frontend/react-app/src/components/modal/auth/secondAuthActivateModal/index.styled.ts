import { styled } from "styled-components";
import InputBG from "/src/assets/backgrounds/6digit-input-bg.svg";

export const ModalBlind = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

export const ModalContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 600px;
  background-color: ${({ theme }) => theme.colors.heavyPurple};
  border-radius: 30px;
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  z-index: 2;
  align-items: center;
  justify-content: space-between;
  padding-block: 80px;
`;

export const Title = styled.h1`
  margin-top: 0;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.freezePurple};
`;

export const TwoFactorContainer = styled.div`
  display: flex;
  height: 150px;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Input = styled.input`
  margin-left: 20px;
  padding-left: 10px;
  width: 240px;
  height: 40px;
  font-family: monospace;
  font-size: 24px;
  letter-spacing: 1em;
  background: none;
  background-image: url(${InputBG});
  background-repeat: no-repeat;
  outline: none;
  border: none;
  overflow: hidden;
`;
