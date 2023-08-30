import {
  Chart,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MatchHistoryType } from "@src/types/game.type";
import * as S from "./index.styled";
import { ProfileModalOnClickHandler } from "@src/utils";
import { useRecoilState } from "recoil";
import { showProfileState } from "@src/recoil/atoms/common";
import { useState } from "react";
import { SortDropdownComponent } from "@src/components/dropdown";
import SearchIcon from "@src/assets/icons/MagnifyingGlass.svg";
import { Theme } from "@src/styles/Theme";

Chart.register(ArcElement, DoughnutController, Title, Tooltip, Legend, Filler);

interface MatchCardProps {
  history: MatchHistoryType;
}

interface MatchHeaderProps {
  userId: string;
  historyList: MatchHistoryType[];
  sortState: string;
  setSortState: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
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
        <S.MatchCardScoreMap>
          {history.map === "normal"
            ? "일반"
            : history.map === "desert"
            ? "사막"
            : "정글"}
        </S.MatchCardScoreMap>
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
        $winLose={winLose}
      >
        {history.gameMode === "rank" ? (winLose === "승리" ? "+" : "") : ""}
        {history.gameMode === "rank" ? playerScoreChange : "-"}
      </S.MatchCardScoreChangeContainer>
    </S.MatchCard>
  );
};

type MapStatsType = {
  wins: number;
  losses: number;
  totalScore: number;
  totalLoseScore: number;
};

type MapType = "normal" | "desert" | "jungle";

export const MatchHeader = ({
  userId,
  historyList,
  sortState,
  setSortState,
  search,
  setSearch,
}: MatchHeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const maps: MapType[] = ["normal", "desert", "jungle"];
  const mapStats: Record<MapType, MapStatsType> = {
    normal: {
      wins: 0,
      losses: 0,
      totalScore: 0,
      totalLoseScore: 0,
    },
    desert: {
      wins: 0,
      losses: 0,
      totalScore: 0,
      totalLoseScore: 0,
    },
    jungle: {
      wins: 0,
      losses: 0,
      totalScore: 0,
      totalLoseScore: 0,
    },
  };

  // historyList를 순회하며 각 맵별 승패와 득점, 실점 정보를 구함
  historyList.forEach((history) => {
    // 승리 여부 판단
    const isWin =
      (history.player1.id === userId && history.player1Score === 5) ||
      (history.player2.id === userId && history.player2Score === 5);

    const score: number =
      history.player1.id === userId
        ? history.player1Score
        : history.player2Score;
    const loseScore: number =
      history.player1.id === userId
        ? history.player2Score
        : history.player1Score;

    // 해당 맵의 통계 정보 업데이트
    if (isWin) {
      mapStats[history.map as MapType].wins += 1;
    } else {
      mapStats[history.map as MapType].losses += 1;
    }
    mapStats[history.map as MapType].totalScore += score;
    mapStats[history.map as MapType].totalLoseScore += loseScore;
  });

  const winCount = historyList.filter(
    (history) =>
      (history.player1.id === userId && history.player1Score === 5) ||
      (history.player2.id === userId && history.player2Score === 5),
  ).length;
  const loseCount = historyList.length - winCount;

  // 총 득점
  const totalScore = historyList.reduce((acc, cur) => {
    acc += cur.player1.id === userId ? cur.player1Score : cur.player2Score;
    return acc;
  }, 0);

  // 총 실점
  const totalLoseScore = historyList.reduce((acc, cur) => {
    acc += cur.player1.id === userId ? cur.player2Score : cur.player1Score;
    return acc;
  }, 0);

  console.log("historyList", historyList);

  const chartData = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [winCount, loseCount],
        backgroundColor: [Theme.colors.win, Theme.colors.lose],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <S.Header>
      <S.HeaderToolBar>
        <SortDropdownComponent
          sortState={sortState}
          setSortState={setSortState}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          setIsOpenDropdown={setIsOpenDropdown}
          options={["모드 전체", "랭크", "일반"]}
          isOpenDropdown={isOpenDropdown}
          mode="DARK"
          style={{ marginLeft: "20px" }}
        />
        <S.SearchBar>
          <S.SearchBarImg src={SearchIcon} />
          <S.SearchBarInput
            type="text"
            placeholder="유저 검색"
            maxLength={10}
            id="nickname"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </S.SearchBar>
      </S.HeaderToolBar>
      <S.HeaderStatistcs>
        <S.HeaderDoughnutContainer>
          <S.HeaderDoughnutText>
            {historyList.length}전 {winCount}승 {loseCount}패
          </S.HeaderDoughnutText>
          <S.HeaderDoughnut>
            <Doughnut data={chartData} options={chartOptions} />
            <S.DoughnutText>
              {Math.round((winCount / historyList.length) * 100)}%
            </S.DoughnutText>
          </S.HeaderDoughnut>
        </S.HeaderDoughnutContainer>
        <S.HeaderAvgContainer>
          <S.HeaderAvgTotalScore>총 득점 / 총 실점</S.HeaderAvgTotalScore>
          <S.HeaderAvgTotalScore>
            {totalScore} / {totalLoseScore}
          </S.HeaderAvgTotalScore>
          <S.HeaderAvgScore>
            {(totalScore / totalLoseScore).toFixed(2)}:1
          </S.HeaderAvgScore>
        </S.HeaderAvgContainer>
        <S.HeaderMapContainer>
          <S.HeaderMapTitle>맵 통계</S.HeaderMapTitle>
          {maps.map((mapType) => (
            <S.HeaderMapStats key={mapType}>
              <div>
                {mapType === "normal"
                  ? "일반"
                  : mapType === "desert"
                  ? "사막"
                  : "정글"}
              </div>
              <S.HeaderMapStatsWinRate
                win={mapStats[mapType].wins}
                lose={mapStats[mapType].losses}
              >
                {(
                  (mapStats[mapType].wins /
                    (mapStats[mapType].wins + mapStats[mapType].losses)) *
                  100
                ).toFixed(0)}
                {"%"}
              </S.HeaderMapStatsWinRate>
              <div style={{ marginLeft: "4px" }}>
                {mapStats[mapType].wins}승 {mapStats[mapType].losses}패
              </div>
            </S.HeaderMapStats>
          ))}
        </S.HeaderMapContainer>
        <S.Header10gamesContainer />
      </S.HeaderStatistcs>
    </S.Header>
  );
};
