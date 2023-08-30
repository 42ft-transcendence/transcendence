import { MatchHistoryType } from "@src/types/game.type";
import * as S from "./index.styled";
import { ProfileModalOnClickHandler } from "@src/utils";
import { useRecoilState } from "recoil";
import { showProfileState } from "@src/recoil/atoms/common";

interface MatchCardProps {
  history: MatchHistoryType;
}

interface MatchHeaderProps {
  historyList: MatchHistoryType[];
}

const createTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const seconds = diffMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30; // 간단하게 평균적인 값으로 계산했습니다.
  const years = days / 365;

  if (seconds < 60) return "방금 전";
  if (minutes < 60) return Math.round(minutes) + "분 전";
  if (hours < 24) return Math.round(hours) + "시간 전";
  if (days < 30) return Math.round(days) + "일 전";
  if (months < 12) return Math.round(months) + "달 전";
  return Math.round(years) + "년 전";
};

export const MatchCard = ({ history }: MatchCardProps) => {
  const [, setShowProfile] = useRecoilState(showProfileState);
  const currentRoute = window.location.pathname;
  const userId = currentRoute.split("/").pop();

  const player =
    history.player1.id === userId
      ? history.player1
      : history.player2.id === userId
      ? history.player2
      : null;

  let enemy = history.player1;
  if (!player) return <></>;
  if (player.id === history.player1.id) {
    enemy = history.player2;
  }

  let winLose = "";
  if (player) {
    if (history.player1Score > history.player2Score) {
      player.id === history.player1.id
        ? (winLose = "승리")
        : (winLose = "패배");
    } else {
      player.id === history.player1.id
        ? (winLose = "패배")
        : (winLose = "승리");
    }
  }

  let playerScore = history.player1Score;
  let playerScoreChange = history.player1ScoreChange;
  let enemyScore = history.player2Score;
  if (player.id !== history.player1.id) {
    playerScore = history.player2Score;
    enemyScore = history.player1Score;
    playerScoreChange = history.player2ScoreChange;
  }

  return (
    <S.MatchCard mode={winLose}>
      <S.MatchCardMatchInfo>
        <S.MatchCardMatchInfoGameType mode={winLose}>
          {history.gameMode === "normal" ? "일반" : "랭크"}
        </S.MatchCardMatchInfoGameType>
        <S.MatchCardMatchInfoDate>
          {createTimeAgo(history.createdAt.toString())}
        </S.MatchCardMatchInfoDate>
        <S.MatchCardMatchInfoDivider />
        <S.MatchCardMatchInfoWinLose>{winLose}</S.MatchCardMatchInfoWinLose>
      </S.MatchCardMatchInfo>
      <S.MatchCardProfile>
        <S.MatchCardProfileImage
          src={player.avatarPath}
          onClick={ProfileModalOnClickHandler(setShowProfile, true, player)}
        />
        <S.MatchCardProfileNickname
          onClick={ProfileModalOnClickHandler(setShowProfile, true, player)}
        >
          {player.nickname}
        </S.MatchCardProfileNickname>
      </S.MatchCardProfile>
      <S.MatchCardScoreContainer>
        <S.MatchCardScoreMap>맵 추가</S.MatchCardScoreMap>
        <S.MatchCardScoreTextContainer>
          <div style={{ color: "blue" }}>{playerScore}</div>
          <div>:</div>
          <div style={{ color: "red" }}>{enemyScore}</div>
        </S.MatchCardScoreTextContainer>
      </S.MatchCardScoreContainer>
      <S.MatchCardProfile>
        <S.MatchCardProfileNickname
          style={{ marginLeft: "20px" }}
          onClick={ProfileModalOnClickHandler(setShowProfile, true, enemy)}
        >
          {enemy.nickname}
        </S.MatchCardProfileNickname>
        <S.MatchCardProfileImage
          src={enemy.avatarPath}
          style={{ marginRight: "20px" }}
          onClick={ProfileModalOnClickHandler(setShowProfile, true, enemy)}
        />
      </S.MatchCardProfile>
      <S.MatchCardScoreChangeContainer
        mode={history.gameMode}
        winLose={winLose}
      >
        {history.gameMode === "rank" ? (winLose === "승리" ? "+" : "") : ""}
        {history.gameMode === "rank" ? playerScoreChange : "-"}
      </S.MatchCardScoreChangeContainer>
    </S.MatchCard>
  );
};

export const MatchHeader = ({ historyList }: MatchHeaderProps) => {
  console.log("historyList", historyList);
  return (
    <S.Header>
      <S.HeaderToolBar></S.HeaderToolBar>
      <S.HeaderStatistcs></S.HeaderStatistcs>
    </S.Header>
  );
};
