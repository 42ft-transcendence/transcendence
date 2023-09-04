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
  display: "flex",
  flexDirection: "column",
  // justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  // overflow: "auto",
};

// export const gameCreateModalContent = styled.div`
//   justifycontent: center;
//   alignitems: center;
//   width: 160px;
//   min-height: 30px;
//   left: 235px;
//   top: auto;
//   bottom: 425px;
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

export const gameCreateModalTitle = styled.h2`
  font-size: 10px;
  font-weight: bold;
  font-family: inter;
  // margin-bottom: 1px;
  color: white;
`;

export const gameCreateModalLabel = styled.label`
  font-size: 10px;
  margin-top: 10px;
  color: white;
`;

export const gameCreateModalInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  color: white;

  border: 1px solid #ccc;
`;

export const gameCreateModalButton = styled.button`
  margin-top: 1rem;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

export const InputBoxWrapper = styled.input`
  width: 80%;
  height: 40px;
  outline: none;
  font-size: 20px;
  background: none;
  text-align: center;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid ${Theme.colors.freezePurple};
  color: ${Theme.colors.freezePurple};
  margin-top: 20px;
`;
