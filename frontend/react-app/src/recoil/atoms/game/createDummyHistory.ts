import { UserType } from "@src/types";
import { MatchHistoryType } from "@src/types/game.type";

export const createDummyHistory = (
  userList: UserType[],
  num: number,
): MatchHistoryType[] => {
  const historyList: MatchHistoryType[] = [];

  for (let i = 0; i < num; i++) {
    let availableUsers = [...userList]; // userList를 복사하여 원본을 수정하지 않게 합니다.

    const randomSeed1 = Math.floor(Math.random() * availableUsers.length);
    const player1 = availableUsers[randomSeed1];
    availableUsers = availableUsers.filter((_, index) => index !== randomSeed1);

    const randomSeed2 = Math.floor(Math.random() * availableUsers.length);
    const player2 = availableUsers[randomSeed2];

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
