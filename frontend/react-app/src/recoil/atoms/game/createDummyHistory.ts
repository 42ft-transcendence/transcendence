import { UserType } from "@src/types";
import { MatchHistoryType } from "@src/types/game.type";

export const createDummyHistory = (
  userList: UserType[],
  num: number,
): MatchHistoryType[] => {
  const historyList: MatchHistoryType[] = [];

  for (let i = 0; i < num; i++) {
    const randomSeed = Math.floor(Math.random() * userList.length);
    const player1 = userList[randomSeed];
    // index == randomseed이면 userList에서 제거
    const player2 = userList.splice(randomSeed, 1)[
      Math.floor(Math.random() * userList.length - 1)
    ];
    const currentTime = new Date().getTime();
    let player1Score = Math.floor(Math.random() * 5);
    let player2Score = Math.floor(Math.random() * 5);
    if (player1Score < player2Score && player2Score !== 5) {
      player2Score = 5;
    } else if (player1Score > player2Score && player1Score !== 5) {
      player1Score = 5;
    }

    historyList.push({
      id: i + 1,
      player1Score: player1Score,
      player2Score: player2Score,
      createdAt: new Date(currentTime + i),
      player1,
      player2,
      gameMode: "ladder",
    });
  }

  return historyList;
};
