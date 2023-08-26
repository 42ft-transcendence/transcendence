import { Theme } from "@src/styles/Theme";
import styled from "styled-components";

export const ModalContent = {
  backgroundColor: Theme.colors.freezePurple,
  width: "160px",
  minHeight: "30px",
  left: "235px",
  top: "auto",
  bottom: "425px",
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
};

export const ModalOverlay = {
  background: "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const NicknameContainer = styled.div`
  width: 90%;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NicknameText = styled.div`
  minwidth: 10px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  color: ${Theme.colors.freezePurple};
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const PencilIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 10px;
`;
