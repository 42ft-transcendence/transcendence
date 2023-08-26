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

export const HandleImageChangeButton = styled.input`
  fond-size: 30px;
  font-weight: bold;
  font-family: inter;
  color: ${Theme.colors.freezePurple};
  padding: 0px;
  margin: 0px;
  cursor: pointer;
  color: black;
  minwidth: 100px;
`;
