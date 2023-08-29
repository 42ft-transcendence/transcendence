import { Injectable } from '@nestjs/common';
import { ChattingGateway } from 'src/chatting/chatting.gateway';
import { UsersService } from 'src/users/users.service';
import {
  roomManager,
  getPlayerWithRoomnum,
  checkReady,
  finishScore,
  GameData,
  getUser,
} from './game.gateway';
import { Server, Socket } from 'socket.io';
import { HistoryDto } from 'src/match_history/history.dto';
import { User } from 'src/users/entities/user.entity';
import { GameGateway } from './game.gateway';
import { MatchHistorysService } from 'src/match_history/history.service';
@Injectable()
export class GameService {
  constructor(
    private usersService: UsersService,
    private gameGateway: GameGateway,
    private matchHistorysService: MatchHistorysService,
  ) {}

  async offerGame(user_id: string, nickname: string): Promise<boolean> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const content = {
        user_id: user_id,
        nickname: nickname,
      };
      this.gameGateway.offerGame('offerGame', content);
      return true;
    }
  }

  /**몰수 처리 */
  async ConfiscationProcess(
    roomNum: number,
    userLeft: string,
    userright: string,
    connectedNickName: string,
    server: Server,
  ) {
    const gameData = roomManager.get(roomNum);

    /**게임중 일 때 => DB에 결과 반영까지 해야됨*/
    if (gameData.onGame) {
      // 게임상태를 false로 바꾼다.
      gameData.onGame = false;
      // 왼쪽이 나갔다면 오른쪽이 이김
      if (connectedNickName == userLeft) {
        gameData.score = [0, finishScore + 1];
        // 오른쪽이 나갔다면 왼쪽이 이기게
      } else if (connectedNickName == userright) {
        gameData.score = [finishScore + 1, 0];
      }
      // 게임이 끝났다고 알린다.
      server.to(roomNum.toString()).emit('finished', gameData.score);
      // 게임 결과를 DB에 반영한다.
      await this.pushHistory(roomNum, gameData.mode);
      // 게임 결과를 반영한다.
      await this.gameResultProcess(gameData, roomNum);
      gameData.score = [0, 0];
      gameData.reset();
      if (roomNum % 2) {
        checkReady.get(roomNum)[0] = false;
        checkReady.get(roomNum)[1] = false;
      }
    }
  }

  /** 게임 전적을 저장한다. */
  //게임 모드와, 플레이어의 점수를 저장한다.
  async pushHistory(roomNumber: number, mode: number) {
    let gameModeselector: string;

    if (mode == 0) {
      gameModeselector = '랭크';
    } else if (mode == 1) {
      gameModeselector = '일반';
    } else if (mode == 2) {
      gameModeselector = '일반-포탈';
    } else {
      gameModeselector = 'unknown';
    }
    const historyDtoTmp: HistoryDto = {
      player1score: roomManager.get(roomNumber).score[0],
      player2score: roomManager.get(roomNumber).score[1],
      player1: '',
      player2: '',
      gameMode: gameModeselector,
    };
    this.matchHistorysService.putHistory(
      historyDtoTmp,
      getUser.get(roomNumber)[0],
      getUser.get(roomNumber)[1],
    );
    // await this.channelService.deleteChannelByChannelName("game" + roomNumber);
    console.log('add history');
  }

  async gameResultProcess(gameData: GameData, room: number) {
    const winLose = gameData.score[0] - gameData.score[1];
    const isRank = room % 2;
    const user = getUser.get(room);

    await this.updateGameInfo(user[0], winLose, isRank);
    await this.updateGameInfo(user[1], winLose * -1, isRank);
  }

  async updateGameInfo(user: User, WinLose: number, isRank: number) {
    user = await this.usersService.getUserById(user.id);
    if (isRank == 0) {
      if (WinLose > 0) {
        user.rating += 15;
        user.ladder_win++;
      } else {
        user.rating -= 10;
        user.ladder_lose++;
      }
      await this.usersService.updateLadderGameRecord(user);
    } else {
      if (WinLose > 0) {
        user.win++;
      } else {
        user.lose++;
      }
      await this.usersService.updateNormalGameRecord(user);
    }
    console.log('updat user info');
  }

  async checkUserSet(roomNum: number): Promise<[boolean, boolean]> {
    const tmp = getPlayerWithRoomnum.get(roomNum);
    const result: [boolean, boolean] = [false, false];
    if (tmp[0] != '') {
      result[0] = true;
    } else {
      result[0] = false;
    }
    if (tmp[1] != '') {
      result[1] = true;
    } else {
      result[1] = false;
    }

    return result;
  }
}
