import { DefaultTheme } from "styled-components";

const colors = {
  iceCold: "#A0D2EB",
  freezePurple: "#E5EAF5",
  darkFreezePurple: "rgba(229, 234, 245, 0.3)",
  mediumPurple: "#D0BDF4",
  purplePlain: "#8458B3",
  heavyPurple: "#494D5F",
  floating: "#D7DCE6",
  myChat: "#97A7DB",

  win: "#86AEEA",
  lose: "#EDA1A1",
  rank: "#F1C644",
  deepWin: "#5C9EEA",
  deepLose: "#E27D5D",

  gold: "#F1C644",
  silver: "#9F9F9F",
  bronze: "#FC8D5D",

  online: "#9BF499",
  gaming: "#E27D5D",
  offline: "#979797",
};

export type ColorsTypes = typeof colors;

export const Theme: DefaultTheme = {
  colors,
};
