import { UserType } from "@src/types";
import { MatchHistoryType } from "@src/types/game.type";

export const createDummyHistory = (
  userList: UserType[],
  num: number,
): MatchHistoryType[] => {
  const historyList: MatchHistoryType[] = [];

  for (let i = 0; i < num; i++) {
    let availableUsers = [...userList]; // userList를 복사하여 원본을 수정하지 않게 합니다.

    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 과거 한 달을 밀리초로
    const randomTimeAgo = Math.random() * oneMonthInMs; // 랜덤한 밀리초 값 (0부터 과거 한 달 사이)
    const randomPastTime = new Date().getTime() - randomTimeAgo; // 랜덤한 과거 시간

    const randomSeed1 = Math.floor(Math.random() * availableUsers.length);
    const player1 = availableUsers[randomSeed1];
    availableUsers = availableUsers.filter((_, index) => index !== randomSeed1);

    const randomSeed2 = Math.floor(Math.random() * availableUsers.length);
    const player2 = availableUsers[randomSeed2];

    let player1Score = Math.floor(Math.random() * 6); // 0~5 중 랜덤 점수
    let player2Score = 5 - player1Score; // player2는 5에서 player1Score를 뺀 값

    let player1ScoreChange = 0;
    let player2ScoreChange = 0;

    if (player1Score < player2Score) {
      player2Score = 5;
      player1Score = Math.floor(Math.random() * 5); // 0~4 중 랜덤 점수
      player1ScoreChange = Math.floor(Math.random() * 30 + 1) * -1; // 패배한 player1: -1 ~ -30
      player2ScoreChange = Math.floor(Math.random() * 30 + 1); // 승리한 player2: 1 ~ 30
    } else {
      player1Score = 5;
      player2Score = Math.floor(Math.random() * 5); // 0~4 중 랜덤 점수
      player1ScoreChange = Math.floor(Math.random() * 30 + 1); // 승리한 player1: 1 ~ 30
      player2ScoreChange = Math.floor(Math.random() * 30 + 1) * -1; // 패배한 player2: -1 ~ -30
    }

    historyList.push({
      id: i + 1,
      player1Score: player1Score,
      player2Score: player2Score,
      createdAt: new Date(randomPastTime),
      player1,
      player2,
      player1ScoreChange,
      player2ScoreChange,
      gameMode: Math.random() < 0.5 ? "rank" : "normal", // 수정된 게임 모드 랜덤 선택 로직
    });
  }

  return historyList;
};
