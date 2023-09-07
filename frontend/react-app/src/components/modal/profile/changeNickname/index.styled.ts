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

export const ModalContent: React.CSSProperties = {
  backgroundColor: Theme.colors.heavyPurple,
  inset: "auto",
  width: "400px",
  height: "350px",
  border: `2px solid ${Theme.colors.freezePurple}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  gap: "10px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
};

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  font-family: inter;
  color: ${Theme.colors.freezePurple};
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 50px;
`;

export const DuplicatedNicknameText = styled.div.attrs<{ $validated: boolean }>(
  ({ $validated }) => ({
    style: {
      color: $validated === true ? Theme.colors.win : Theme.colors.lose,
    },
  }),
)<{ $validated: boolean }>`
  width: 292px;
  height: 16px;
  outline: none;
  font-size: 10px;
  font-family: inter;
  background: none;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-bottom: 34px;
`;
