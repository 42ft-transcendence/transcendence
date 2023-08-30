import { styled } from "styled-components";

export const Header = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  flex-direction: column;
  align-items: center;
`;

export const HeaderToolBar = styled.div`
  display: flex;
  width: 98%;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  border-radius: 7px 7px 0 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.freezePurple};
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const HeaderStatistcs = styled.div`
  display: flex;
  width: 98%;
  height: 150px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 0 0 7px 7px;
  background-color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 200px);
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  margin-top: 10px;
`;

export const MatchCard = styled.div<{ mode: string }>`
  display: flex;
  width: 98%;
  height: 100px;
  margin-bottom: 10px;
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
  cursor: pointer;
`;

export const MatchCardProfileNickname = styled.span`
  font-size: 16px;
  font-weight: bold;
  font-family: inter;
  margin-right: 20px;
  color: ${(props) => props.theme.colors.heavyPurple};
  cursor: pointer;
`;

export const MatchCardScoreContainer = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const MatchCardScoreMap = styled.div`
  font-size: 14px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) => props.theme.colors.heavyPurple};
`;

export const MatchCardScoreTextContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  font-size: 32px;
  font-weight: bold;
  font-family: inter;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 7px;
`;

export const MatchCardScoreChangeContainer = styled.div<{
  mode: string;
  winLose: string;
}>`
  display: flex;
  width: 12%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  font-family: inter;
  color: ${(props) =>
    props.mode === "rank" && props.winLose === "승리"
      ? "blue"
      : props.mode === "rank" && props.winLose === "패배"
      ? "red"
      : props.theme.colors.heavyPurple};
`;
