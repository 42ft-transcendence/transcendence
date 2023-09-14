import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { GameData } from './game.engine';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { HistoryDto } from 'src/match_history/dto/history.dto';

export type GameRoomType =
  | 'PUBLIC'
  | 'PROTECTED'
  | 'PRIVATE'
  | 'CREATING'
  | 'RANKING'
  | '';

export interface GameRoomParticipant {
  user: User;
  ready: boolean;
}

export enum GameRoomStatus {
  WAITING = 0,
  GAMING = 1,
}

@Injectable()
export class GameRoom {
  roomURL: string;
  roomName: string;
  roomType: GameRoomType;
  roomPassword: string;
  roomOwner: User;
  numberOfParticipants: number;
  gameMode: string;
  map: string;
  participants: GameRoomParticipant[];
  status: GameRoomStatus;
  countsOfDisconnect: number;
  onGame: boolean[];
  timeout: NodeJS.Timeout;
  gameEngine: GameData;

  constructor(
    data: Partial<GameRoom>,
    @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
    private gameService: GameService,
  ) {
    Object.assign(this, data);
  }

  /**
   * Getter for GameRoom
   */
  getGameRoomInfo(): Partial<GameRoom> {
    return {
      roomURL: this.roomURL,
      roomName: this.roomName,
      roomType: this.roomType,
      roomOwner: this.roomOwner,
      numberOfParticipants: this.numberOfParticipants,
      gameMode: this.gameMode,
      map: this.map,
      participants: this.participants,
      status: this.status,
      countsOfDisconnect: this.countsOfDisconnect,
      onGame: this.onGame,
    };
  }

  getGameEngine(): GameData {
    return this.gameEngine;
  }

  /**
   * Setter for GameRoom
   */
  setGameRoomInfo(data: Partial<GameRoom>): void {
    Object.assign(this, data);
  }

  setParticipantReady(userId: string, ready: boolean): void {
    const participant = this.participants.find(
      (participant) => participant.user.id === userId,
    );
    if (participant) participant.ready = ready;
  }

  private sendStartGameMessage(): void {
    const response = {
      gameRoomURL: this.roomURL,
      gameData: this.getGameEngine(),
    };
    this.gameGateway.server.emit('startGame', response);
  }

  connection(userId: string): void {
    const userIndex = this.participants.findIndex(
      (participant) => participant.user.id === userId,
    );
    this.onGame[userIndex] = true;
    if (this.onGame.every((value) => value === true)) {
      this.countsOfDisconnect = 0;
    }
  }

  disconnection(userId: string): void {
    const userIndex = this.participants.findIndex(
      (participant) => participant.user.id === userId,
    );
    this.onGame[userIndex] = false;
  }

  enterGameRoom(user: User): void {
    const isUserInRoom = this.participants.some(
      (participant) => participant.user.id === user.id,
    );
    if (isUserInRoom) return;
    this.participants.push({ user: user, ready: false });
    this.numberOfParticipants++;
  }

  exitGameRoom(user: User): void {
    const exitUserIndex = this.participants.findIndex(
      (participant) => participant.user.id === user.id,
    );
    if (exitUserIndex === -1) return;
    if (
      this.numberOfParticipants === 2 &&
      this.participants[exitUserIndex].user.id === this.roomOwner.id
    ) {
      this.roomOwner = this.participants.find(
        (participant) => participant.user.id !== user.id,
      )?.user;
    }
    this.participants.splice(exitUserIndex, 1);
    this.numberOfParticipants--;
  }

  startGame(): void {
    try {
      if (this.timeout) {
        clearInterval(this.timeout);
      }
      this.status = GameRoomStatus.GAMING;
      this.gameEngine = new GameData(this.gameMode);
      this.countsOfDisconnect = 0;
      this.onGame = [true, true];
      this.sendStartGameMessage();
      this.timeout = setInterval(() => {
        this.gameProcess();
      }, 1000 / 60);
    } catch (e) {
      console.log(e);
    }
  }

  gameProcess(): void {
    if (this.onGame.includes(false)) this.countsOfDisconnect++;
    if (this.countsOfDisconnect >= 300) {
      const disconnectedIndex = this.onGame.findIndex(
        (value) => value === false,
      );
      if (disconnectedIndex !== -1) {
        this.surrenderGame(this.participants[disconnectedIndex].user.id);
        return;
      }
    }

    if (!this.gameEngine) return;

    this.emitGameProcessData();
    this.emitGameScoreData();

    if (this.gameEngine.score[0] >= 5 || this.gameEngine.score[1] >= 5) {
      this.finishGame(false);
      return;
    }
  }

  private emitGameProcessData(): void {
    const response = {
      gameRoomURL: this.roomURL,
      gameData: this.gameEngine,
    };
    this.gameGateway.server.emit('gameProcess', response);
  }

  private emitGameScoreData(): void {
    this.gameGateway.server.emit('gameScore', {
      gameRoomURL: this.roomURL,
      user1Score: this.gameEngine.score[0],
      user2Score: this.gameEngine.score[1],
    });
  }

  userPaddle(content: {
    gameRoomURL: string;
    userIndex: number;
    userPaddle: number;
  }) {
    let paddleDelta;
    if (content.userIndex === 0) {
      paddleDelta = content.userPaddle - this.gameEngine.leftPaddle;
      this.gameEngine.leftPaddle = content.userPaddle;
    } else {
      paddleDelta = content.userPaddle - this.gameEngine.rightPaddle;
      this.gameEngine.rightPaddle = content.userPaddle;
    }
    content.userIndex === 0
      ? (this.gameEngine.leftPaddle = content.userPaddle)
      : (this.gameEngine.rightPaddle = content.userPaddle);
    this.gameEngine.advance(paddleDelta);
  }

  makeMatchHistory(): void {
    const historyDto = new HistoryDto();
    const [player1updated, player2updated] = this.gameGateway.eloRatingSystem(
      this.participants[0].user,
      this.participants[1].user,
      this.gameEngine.score[0],
      this.gameEngine.score[1],
      this.roomType,
    );
    historyDto.player1Score = this.gameEngine.score[0];
    historyDto.player2Score = this.gameEngine.score[1];
    historyDto.player1ScoreChange =
      this.roomType === 'RANKING' ? player1updated : 0;
    historyDto.player2ScoreChange =
      this.roomType === 'RANKING' ? player2updated : 0;
    historyDto.player1 = this.participants[0].user;
    historyDto.player2 = this.participants[1].user;
    historyDto.roomType = this.roomType;
    historyDto.map = this.map;
    historyDto.isDummy = false;
    this.gameGateway.makeMatchHistory(historyDto);
  }

  finishGame(isSurrender: boolean): void {
    console.log('finishGame');
    const engine = this.getGameEngine();
    if (!engine) return;
    clearInterval(this.timeout);
    this.makeMatchHistory();
    const finishedResponse = {
      gameRoomURL: this.roomURL,
      winner: engine.score[0] > engine.score[1] ? 0 : 1,
      isSurrender: isSurrender,
    };
    this.status = GameRoomStatus.WAITING;
    // roomTimeout와 roomManager 관련 코드 처리...
    if (this.roomType === 'RANKING') {
      this.gameService.deleteGameRoom(this.roomURL);
    } else {
      this.participants[0].ready = false;
      this.participants[1].ready = false;
      console.log('finishGame - this.participants', this.participants);
      if (isSurrender) {
        const surrenderUserIndex = this.onGame.findIndex(
          (value) => value === false,
        );
        this.exitGameRoom(this.participants[surrenderUserIndex].user);
      }
    }
    this.gameGateway.server.emit('finishedGame', finishedResponse);
    this.gameGateway.refreshGameRoomList();
  }

  surrenderGame(userId: string): void {
    const engine = this.getGameEngine();
    if (!engine) return;
    const userIndex = this.participants.findIndex(
      (participant) => participant.user.id === userId,
    );
    if (userIndex === -1) return;
    engine.score[userIndex] = 0;
    engine.score[(userIndex + 1) % 2] = 5;
    this.finishGame(true);
  }
}
