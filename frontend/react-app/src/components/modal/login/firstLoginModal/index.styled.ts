import { styled, keyframes } from "styled-components";

export const ModalOverlay = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const modalFadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  50% {
    opacity: 1;
    transform: translateY(0%);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
`;

export const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.heavyPurple};
  color: ${(props) => props.theme.colors.freezePurple};
  padding: 20px;
  width: 350px;
  height: 60px;
  fond-size: 30px;
  font-weight: bold;
  font-family: inter;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  animation: ${modalFadeInOut} 5s ease-in-out forwards;
`;
