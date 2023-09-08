import { Theme } from "@src/styles/Theme";
import styled from "styled-components";

export const ModalContent: React.CSSProperties = {
  width: "400px",
  height: "400px",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Theme.colors.heavyPurple,
  borderRadius: "20px",
  border: `2px solid ${Theme.colors.freezePurple}`,
  color: Theme.colors.freezePurple,
  fontSize: "1.5rem",
  fontWeight: "bold",
  fontFamily: "inter",
  gap: "50px",
};

export const LoadingImageStyle = styled.img`
  width: 100px;
  height: 100px;
`;
