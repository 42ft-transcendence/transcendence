import { styled } from "styled-components";

export const Header = styled.div`
  display: flex;
  width: 100%;
  height: 120px;
  background-color: red;
  align-items: center;
  justify-content: center;
`;

export const MatchContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 120px);
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.gold};
`;

export const MatchCard = styled.div<{ mode: string }>`
  display: flex;
  width: 90%;
  height: 120px;
  background-color: ${(props) =>
    props.mode === "win" ? props.theme.colors.win : props.theme.colors.lose};
`;
