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
  overflow-y: scroll;
`;

export const MatchCard = styled.div<{ mode: string }>`
  display: flex;
  width: 90%;
  height: 100px;
  border-radius: 7px;
  border-left: 7px solid
    ${(props) =>
      props.mode === "승리"
        ? props.theme.colors.deepWin
        : props.theme.colors.deepLose};
  background-color: ${(props) =>
    props.mode === "승리"
      ? props.theme.colors.win
      : props.mode === "패배"
      ? props.theme.colors.lose
      : props.theme.colors.floating};
`;

export const MatchCardMatchInfo = styled.div`
  display: flex;
  width: 12%;
  height: 100px;
  gap: 7px;
  flex-direction: column;
  justify-content: center;
`;

export const MatchCardMatchInfoGameType = styled.div<{ mode: string }>`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  font-family: inter;
  margin-left: 7px;
  color: ${(props) =>
    props.mode === "승리" ? "blue" : props.mode === "패배" ? "red" : "gray"};
`;

export const MatchCardMatchInfoDate = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: inter;
  margin-left: 7px;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardMatchInfoDivider = styled.div`
  width: 40%;
  height: 0.5px;
  margin-left: 7px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardMatchInfoWinLose = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-family: inter;
  margin-left: 7px;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardProfile = styled.div`
  display: flex;
  width: 28%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const MatchCardProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-left: 20px;
  background-color: ${(props) => props.theme.colors.floating};
`;

export const MatchCardProfileNickname = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-family: inter;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardScore = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.silver};
`;

export const MatchCardEnemyProfile = styled.div`
  display: flex;
  width: 28%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.bronze};
`;

export const MatchCardEnemyButtonContainer = styled.div`
  display: flex;
  width: 12%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.silver};
`;
