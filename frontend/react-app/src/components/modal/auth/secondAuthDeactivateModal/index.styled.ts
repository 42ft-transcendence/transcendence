import { styled } from "styled-components";

export const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  background: none;
  z-index: 230;
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
  background-color: ${({ theme }) => theme.colors.heavyPurple};
  border: 1px solid ${({ theme }) => theme.colors.freezePurple};
  border-radius: 30px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
  z-index: 231;
`;

export const Title = styled.h2`
  max-width: 450px;
  margin: 0 0 20px;
  color: ${({ theme }) => theme.colors.freezePurple};
  font-size: 32px;
  font-weight: Bold;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;
