import { Theme } from "@src/styles/Theme";
import { styled } from "styled-components";

export const ModalOverlay: React.CSSProperties = {
  background: "transparent",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  width: "100%",
  height: "100%",
};

export const ModalContent: React.CSSProperties = {
  width: "400px",
  height: "200px",
  background: Theme.colors.heavyPurple,
  borderRadius: "10px",
  inset: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "40px",
  border: `2px solid ${Theme.colors.freezePurple}`,
  color: Theme.colors.freezePurple,
};

export const ModalMessage = styled.p`
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  color: ${Theme.colors.freezePurple};
  align-self: center;
`;
