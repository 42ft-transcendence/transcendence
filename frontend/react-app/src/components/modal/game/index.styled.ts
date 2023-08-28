import { Theme } from "@src/styles/Theme";
import styled from "styled-components";

export const ModalOverlay = {
  background: "transparent",
  justifyContent: "center",
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center",
};

export const ModalContent = {
  backgroundColor: Theme.colors.heavyPurple,
  inset: "auto",
  width: "700px",
  height: "550px",
  border: `2px solid ${Theme.colors.freezePurple}`,
  display: "center",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  overflow: "auto",
};

export const gameCreateModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const gameCreateModalLabel = styled.label`
  font-size: 1rem;
  margin-top: 1rem;
`;

export const gameCreateModalInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
`;

export const gameCreateModalButton = styled.button`
  margin-top: 1rem;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;

  // &:hover {
  //   background-color: #0056b3;
`;
