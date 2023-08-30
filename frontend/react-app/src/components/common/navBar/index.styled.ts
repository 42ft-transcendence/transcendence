import { styled } from "styled-components";
import { Theme } from "@styles/Theme";

export const Container = styled.div`
  display: flex;
  width: 50px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  background-color: ${Theme.colors.heavyPurple};
  border-right: 1px solid ${Theme.colors.darkFreezePurple};
  flex-shrink: 50px;
`;

export const TabList = styled.ul`
  display: flex;
  width: 100%;
  height: max-content;
  margin-block: 10px;
  gap: 18px;
  flex-direction: column;
  align-items: center;
`;

export const ItemIcon = styled.img`
  width: 32px;
  height: 32px;
`;

export const SettingOptionModalContentWrapper = styled.div`
  display: flex;
  width: 150px;
  min-height: 30px;
  flex-direction: column;
`;

export const SettingOptionModalButton = styled.span`
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

export const SettingOptionModalDivider = styled.div`
  border-top: 1px solid #ccc;
  margin: 10px 0px;
  width: 100px;
`;

export const SettingOptionModalContent = {
  backgroundColor: Theme.colors.freezePurple,
  width: "150px",
  minHeight: "30px",
  left: "50px",
  top: "auto",
  bottom: "50px",
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
};

export const SettingOptionModalOverlay = {
  background: "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
