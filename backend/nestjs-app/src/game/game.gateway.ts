import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { TMP, UserStatusType, RoomData } from 'src/util';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MatchHistorysService } from 'src/match_history/history.service';
import * as bcrypt from 'bcrypt';
import { ChattingGateway } from 'src/chatting/chatting.gateway';
import { HistoryDto } from 'src/match_history/dto/history.dto';
import { GameData } from './game.engine';
import {
  GameRoom,
  GameRoomStatus,
  GameRoomType,
  GameService,
} from './game.service';
import { SHA256 } from 'crypto-js';

const roomManager = new Map<string, GameData>();
const roomTimeout = new Map<string, NodeJS.Timeout>();
const rankGameWaitingQueue = [];

@WebSocketGateway({
  middlewares: [],
  namespace: '/game',
})
export class GameGateway {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private matchHistorysService: MatchHistorysService,
    private gameService: GameService,
    private gameData: GameData,
  ) {}

  @WebSocketServer()
  server: Server;

  refreshGameRoomList() {
    this.server.emit('roomList', this.gameService.getAllGameRooms());
  }

  @SubscribeMessage('getGameRoomList')
  getGameRoomList(client: Socket) {
    this.refreshGameRoomList();
  }

  @SubscribeMessage('sendGameRoomChat')
  sendGameRoomChat(
    client: Socket,
    content: {
      roomURL: string;
      roomName: string;
      message: string;
      userId: string;
      userNickname: string;
      createdAt: Date;
    },
  ) {
    this.server.emit('getGameRoomChat', content);
  }

  @SubscribeMessage('joinRankGame')
  joinRankGame(client: Socket, content: { user: User }) {
    if (rankGameWaitingQueue.map((user) => user.id).includes(content.user.id))
      return;
    rankGameWaitingQueue.push(content.user);
    if (rankGameWaitingQueue.length >= 2) {
      const user1 = rankGameWaitingQueue.shift();
      const user2 = rankGameWaitingQueue.shift();
      const newRoom: GameRoom = {
        roomURL: SHA256(new Date() + user1.id + user2.id).toString(),
        roomName: '랭킹전',
        roomType: 'RANKING',
        roomPassword: '',
        roomOwner: user1,
        numberOfParticipants: 2,
        gameMode: ['SLOW', 'NORMAL', 'FAST'][Math.floor(Math.random() * 3)],
        map: 'NORMAL',
        participants: [
          { user: user1, ready: false },
          { user: user2, ready: false },
        ],
        status: GameRoomStatus.WAITING,
      };
      this.gameService.createGameRoom(newRoom);
      const response = {
        gameRoomURL: newRoom.roomURL,
        gameRoom: newRoom,
        participants: [user1, user2],
      };
      this.server.emit('joinRankGame', response);
    }
  }

  @SubscribeMessage('cancleRankGame')
  cancleRankGame(client: Socket, content: { user: User }) {
    const userIndex = rankGameWaitingQueue.indexOf(content.user);
    rankGameWaitingQueue.splice(userIndex, 1);
  }

  @SubscribeMessage('exitRankGameRoom')
  exitRankGameRoom(
    client: Socket,
    content: { gameRoomURL: string; user: User },
  ) {
    // TODO: 요청 보낸 유저는 점수 감소
    this.userService.updateRating(content.user, -20);
    // TODO: gameRoomURL을 가진 두 유저에게 정보 전달
    const response = {
      gameRoomURL: content.gameRoomURL,
      exitUser: content.user,
    };
    this.server.emit('exitRankGameRoom', response);
    this.gameService.deleteGameRoom(content.gameRoomURL);
  }

  @SubscribeMessage('offerBattle')
  async offerBattle(
    client: Socket,
    content: {
      awayUser: User;
      myData: User;
      gameRoomURL: string;
      roomType: GameRoomType;
    },
  ) {
    const newRoom: GameRoom = {
      roomURL: content.gameRoomURL,
      roomName: content.myData.nickname + ' vs ' + content.awayUser.nickname,
      roomType: content.roomType,
      roomPassword: '',
      roomOwner: content.myData,
      numberOfParticipants: 2,
      gameMode: 'NORMAL',
      map: 'NORMAL',
      participants: [
        { user: content.myData, ready: false },
        { user: content.awayUser, ready: false },
      ],
      status: GameRoomStatus.WAITING,
    };
    this.gameService.createGameRoom(newRoom);
    await this.userService.updateStatus(content.myData, UserStatusType.GAME);
    this.server.emit('offerBattle', content);
  }

  @SubscribeMessage('createGameRoom')
  async createGameRoom(
    client: Socket,
    content: { user: User; gameRoomURL: string },
  ) {
    const newRoom: GameRoom = {
      roomURL: content.gameRoomURL,
      roomName: '',
      roomType: 'PUBLIC',
      roomPassword: '',
      roomOwner: content.user,
      numberOfParticipants: 1,
      gameMode: 'NORMAL',
      map: 'NORMAL',
      participants: [{ user: content.user, ready: false }],
      status: GameRoomStatus.WAITING,
    };
    this.gameService.createGameRoom(newRoom);
    await this.userService.updateStatus(content.user, UserStatusType.GAME);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('deleteGameRoom')
  deleteGameRoom(client: Socket, content: { gameRoomURL: string }) {
    this.gameService.deleteGameRoom(content.gameRoomURL);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('editGameRoomInfo')
  editGameRoomInfo(
    client: Socket,
    content: {
      gameRoomURL: string;
      infoType: string;
      info: string | number | boolean | GameRoomType;
    },
  ) {
    console.log('editGameRoomInfo: ', content);
    if (content.infoType === 'roomName') {
      this.gameService.editGameRoomName(
        content.gameRoomURL,
        content.info as string,
      );
    } else if (content.infoType === 'roomType') {
      this.gameService.editGameRoomType(
        content.gameRoomURL,
        content.info as GameRoomType,
      );
    } else if (content.infoType === 'roomPassword') {
      this.gameService.editGameRoomPassword(
        content.gameRoomURL,
        content.info as string,
      );
    } else if (content.infoType === 'gameMode') {
      this.gameService.editGameRoomGameMode(
        content.gameRoomURL,
        content.info as string,
      );
    }
    this.refreshGameRoomList();
    console.log(
      'editGameRoomInfo: ',
      this.gameService
        .getAllGameRooms()
        .find((room) => room.roomURL === content.gameRoomURL),
    );
  }

  @SubscribeMessage('acceptBattle')
  async acceptBattle(
    client: Socket,
    content: { gameRoomURL: string; user1Id: string; user2Id: string },
  ) {
    const gameRoom = this.gameService.getAllGameRooms().find((room) => {
      return room.roomURL === content.gameRoomURL;
    });
    console.log('acceptBattle: ', gameRoom);
    const response = {
      gameRoomURL: content.gameRoomURL,
      gameRoom: gameRoom,
      user1Id: content.user1Id,
      user2Id: content.user2Id,
    };
    this.server.emit('acceptBattle', response);
  }

  @SubscribeMessage('rejectBattle')
  rejectBattle(
    client: Socket,
    content: { gameRoomURL: string; awayUserId: string },
  ) {
    this.gameService.deleteGameRoom(content.gameRoomURL);
    const response = {
      gameRoomURL: content.gameRoomURL,
      gameRoom: {} as GameRoom,
      awayUserId: content.awayUserId,
    };
    this.server.emit('rejectBattle', response);
    return true;
  }

  @SubscribeMessage('readyGameRoom')
  readyGameRoom(
    client: Socket,
    content: { gameRoomURL: string; userId: string },
  ) {
    console.log('readyGameRoom: ', content);
    const gameRoom = this.gameService.getAllGameRooms().find((room) => {
      return room.roomURL === content.gameRoomURL;
    });
    console.log('participant: ', gameRoom.participants);
    this.gameService.editGameRoomUserReady(
      content.gameRoomURL,
      content.userId,
      true,
    );
    console.log('participant: ', gameRoom.participants);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('readyCancleGameRoom')
  readyCancleGameRoom(
    client: Socket,
    content: { gameRoomURL: string; userId: string },
  ) {
    this.gameService.editGameRoomUserReady(
      content.gameRoomURL,
      content.userId,
      false,
    );
    this.refreshGameRoomList();
  }

  @SubscribeMessage('enterGameRoom')
  async enterGameRoom(
    client: Socket,
    content: { gameRoomURL: string; user: User },
  ) {
    const gameRoom = this.gameService
      .getAllGameRooms()
      .find((room) => room.roomURL === content.gameRoomURL);
    if (!gameRoom) return;
    const gameRoomParticipants = gameRoom.participants;
    const enterUser = gameRoomParticipants.find(
      (participant) => participant.user.id === content.user.id,
    );
    if (enterUser) return;
    gameRoomParticipants.push({ user: content.user, ready: false });
    gameRoom.numberOfParticipants++;
    await this.userService.updateStatus(content.user, UserStatusType.GAME);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('exitGameRoom')
  async exitGameRoom(
    client: Socket,
    content: { gameRoomURL: string; user: User },
  ) {
    const gameRoom = this.gameService
      .getAllGameRooms()
      .find((room) => room.roomURL === content.gameRoomURL);
    if (!gameRoom) return;
    const gameRoomParticipants = gameRoom.participants;
    const exitUser = gameRoomParticipants.find(
      (participant) => participant.user.id === content.user.id,
    );
    const notExitUser = gameRoomParticipants.find(
      (participant) => participant.user.id !== content.user.id,
    );
    if (
      gameRoom.numberOfParticipants === 2 &&
      gameRoom.roomOwner.id === exitUser.user.id
    ) {
      gameRoom.roomOwner = notExitUser.user;
    }
    const exitUserIndex = gameRoomParticipants.indexOf(exitUser);
    gameRoomParticipants.splice(exitUserIndex, 1);
    gameRoom.numberOfParticipants--;
    if (gameRoom.numberOfParticipants === 0) {
      this.gameService.deleteGameRoom(content.gameRoomURL);
      if (content.user.status === UserStatusType.GAME) {
        await this.userService.updateStatus(
          content.user,
          UserStatusType.ONLINE,
        );
      }
      this.refreshGameRoomList();
    }
  }

  @SubscribeMessage('startRankGameCountDown')
  async startRankGameCountDown(
    client: Socket,
    content: { gameRoomURL: string },
  ) {
    // 10초 카운트다운
    for (let i = 10; i >= -1; i--) {
      const response = {
        roomURL: content.gameRoomURL,
        roomName: '랭킹전',
        message:
          i > 0 ? `게임 시작까지 ${i}초 남았습니다.` : '게임이 시작됩니다!',
        userId: 'SYSTEM',
        userNickname: 'SYSTEM',
        createdAt: new Date(),
      };

      // 카운트다운 메시지 발송
      if (i !== -1) {
        this.server.emit('getGameRoomChat', response);
      } else {
        this.startGame(client, content);
      }
      // 1초 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  @SubscribeMessage('startNormalGame')
  startGame(client: Socket, content: { gameRoomURL: string }) {
    const newEngine = new GameData();
    roomManager.set(content.gameRoomURL, newEngine);
    const response = {
      gameRoomURL: content.gameRoomURL,
      gameData: roomManager.get(content.gameRoomURL),
    };
    this.server.emit('startGame', response);
    const intervalId = setInterval(() => {
      this.gameProcess(client, content.gameRoomURL);
    }, 1000 / 60);
    roomTimeout.set(content.gameRoomURL, intervalId);
  }

  @SubscribeMessage('userPaddle')
  userPaddle(
    client: Socket,
    content: { gameRoomURL: string; userIndex: number; userPaddle: number },
  ) {
    const engine = roomManager.get(content.gameRoomURL);
    if (!engine) return;
    let paddleDelta;
    if (content.userIndex === 0) {
      paddleDelta = content.userPaddle - engine.leftPaddle;
      engine.leftPaddle = content.userPaddle;
    } else {
      paddleDelta = content.userPaddle - engine.rightPaddle;
      engine.rightPaddle = content.userPaddle;
    }
    content.userIndex === 0
      ? (engine.leftPaddle = content.userPaddle)
      : (engine.rightPaddle = content.userPaddle);
    engine.advance(paddleDelta);
  }

  gameProcess(client: Socket, gameRoomURL: string) {
    const engine = roomManager.get(gameRoomURL);
    if (!engine) return;
    const response = {
      gameRoomURL: gameRoomURL,
      gameData: engine,
    };
    this.server.emit('gameProcess', response);
    this.server.emit('gameScore', {
      gameRoomURL: gameRoomURL,
      user1Score: engine.score[0],
      user2Score: engine.score[1],
    });
    if (engine.score[0] >= 5 || engine.score[1] >= 5) {
      this.finishGame(client, gameRoomURL);
    }
  }

  finishGame(client: Socket, gameRoomURL: string) {
    const engine = roomManager.get(gameRoomURL);
    if (!engine) return;
    const timeout = roomTimeout.get(gameRoomURL);
    clearInterval(timeout);
    this.makeMatchHistory(gameRoomURL);
    const finishedResponse = {
      gameRoomURL: gameRoomURL,
      winner: engine.score[0] > engine.score[1] ? 0 : 1,
    };
    this.gameService.deleteGameRoom(gameRoomURL);
    roomManager.delete(gameRoomURL);
    roomTimeout.delete(gameRoomURL);
    this.server.emit('finishedRankGame', finishedResponse);
  }

  eloRatingSystem(
    player1: User,
    player2: User,
    player1score: number,
    player2score: number,
    roomType: GameRoomType,
  ) {
    const K = 32;
    const player1rating = player1.rating;
    const player2rating = player2.rating;
    const normalizedPlayer1Score = player1score / 5;
    const normalizedPlayer2Score = player2score / 5;
    const player1expected =
      1 / (1 + Math.pow(10, (player2rating - player1rating) / 400));
    const player2expected =
      1 / (1 + Math.pow(10, (player1rating - player2rating) / 400));
    const player1updated = Math.floor(
      player1rating + K * (normalizedPlayer1Score - player1expected),
    );
    const player2updated = Math.floor(
      player2rating + K * (normalizedPlayer2Score - player2expected),
    );
    if (player1score === 5) {
      if (roomType === 'RANKING') {
        player1.ladder_win++;
        player2.ladder_lose++;
        this.userService.updateLadderGameRecord(player1);
        this.userService.updateLadderGameRecord(player2);
      } else {
        player1.win++;
        player2.lose++;
        this.userService.updateNormalGameRecord(player1);
        this.userService.updateNormalGameRecord(player2);
      }
    } else {
      if (roomType === 'RANKING') {
        player1.ladder_lose++;
        player2.ladder_win++;
        this.userService.updateLadderGameRecord(player1);
        this.userService.updateLadderGameRecord(player2);
      } else {
        player1.lose++;
        player2.win++;
        this.userService.updateNormalGameRecord(player1);
        this.userService.updateNormalGameRecord(player2);
      }
    }
    if (roomType === 'RANKING') {
      this.userService.updateRating(player1, player1updated - player1rating);
      this.userService.updateRating(player2, player2updated - player2rating);
    }
    return [player1updated - player1rating, player2updated - player2rating];
  }

  makeMatchHistory(gameRoomURL: string) {
    const engine = roomManager.get(gameRoomURL);
    const gameRoom = this.gameService
      .getAllGameRooms()
      .find((room) => room.roomURL === gameRoomURL);
    const participants = gameRoom.participants;
    const historyDto = new HistoryDto();
    const [player1updated, player2updated] = this.eloRatingSystem(
      participants[0].user,
      participants[1].user,
      engine.score[0],
      engine.score[1],
      gameRoom.roomType,
    );
    historyDto.player1Score = engine.score[0];
    historyDto.player2Score = engine.score[1];
    historyDto.player1ScoreChange =
      gameRoom.roomType === 'RANKING' ? player1updated : 0;
    historyDto.player2ScoreChange =
      gameRoom.roomType === 'RANKING' ? player2updated : 0;
    historyDto.player1 = participants[0].user;
    historyDto.player2 = participants[1].user;
    historyDto.roomType = gameRoom.roomType;
    historyDto.map = gameRoom.map;
    historyDto.isDummy = false;
    this.matchHistorysService.putHistory(historyDto);
  }

  async createDummyHistory(): Promise<void> {
    const userList = await this.userService.getAllUserList();
    const numberOfUser = userList.length;
    for (let i = 0; i < numberOfUser * 100; i++) {
      let availableUsers = [...userList];
      const roomType = Math.floor(Math.random() * 2) ? 'RANKING' : 'PUBLIC';
      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // 과거 한 달을 밀리초로
      const randomTimeAgo = Math.random() * oneMonthInMs; // 랜덤한 밀리초 값 (0부터 과거 한 달 사이)
      const randomPastTime = new Date().getTime() - randomTimeAgo; // 랜덤한 과거 시간
      const randomSeed1 = Math.floor(Math.random() * availableUsers.length);
      const player1 = availableUsers[randomSeed1];
      availableUsers = availableUsers.filter(
        (_, index) => index !== randomSeed1,
      );
      const randomSeed2 = Math.floor(Math.random() * availableUsers.length);
      const player2 = availableUsers[randomSeed2];
      const historyDto = new HistoryDto();
      const player1Score = Math.floor(Math.random() * 6); // 0~5 중 랜덤 점수
      const player2Score =
        player1Score === 5 ? Math.floor(Math.random() * 5) : 5;
      const [player1updated, player2updated] = this.eloRatingSystem(
        player1,
        player2,
        player1Score,
        player2Score,
        roomType,
      );
      historyDto.player1Score = player1Score;
      historyDto.player2Score = player2Score;
      historyDto.player1ScoreChange =
        roomType === 'RANKING' ? player1updated : 0;
      historyDto.player2ScoreChange =
        roomType === 'RANKING' ? player2updated : 0;
      historyDto.player1 = player1;
      historyDto.player2 = player2;
      historyDto.roomType = roomType;
      historyDto.map = 'NORMAL';
      historyDto.isDummy = true;
      this.matchHistorysService.putHistory(
        historyDto,
        new Date(randomPastTime),
      );
    }
  }

  async handleConnection(client: Socket) {
    console.log('connection game socket: ', client.id);
  }

  async handleDisconnection(client: Socket) {
    const userId = await this.getUserId(client);
    const user = await this.userService.getUserById(userId);
    console.log('disconnection game socket: ', client.id);
    if (roomManager.has(client.id)) {
      const gameData = roomManager.get(client.id);
      if (gameData.onGame) {
        gameData.onGame = false;
        // 내가 참여중인 gameRoom 찾아서 몰수패 처리하기
        const gameRoom = this.gameService.getAllGameRooms().find((room) =>
          room.participants.find((participant) => {
            return participant.user.id === user.id;
          }),
        );
        if (gameRoom) {
          if (gameRoom.roomOwner.id === user.id) {
            gameData.score[1] = 6;
          } else {
            gameData.score[0] = 6;
          }
        }
        this.server.to(client.id).emit('finished', gameData.score);
        // 매치히스토리도 업데이트 해야함
      }
      roomManager.delete(client.id);
    }
  }

  private async getUserId(client: Socket) {
    try {
      let jwt = String(client.handshake.headers.authorization);
      jwt = jwt.replace('Bearer ', '');
      const user: TMP = await this.authService.jwtVerify(jwt);
      console.log(`success getuserid: ${user.id}`);
      return user.id;
    } catch (e) {
      throw {};
    }
  }

  // @SubscribeMessage('processGameFrame')
  // async processGameFrame(
  //   client: Socket,
  //   content: {
  //     userLocation: number;
  //     paddlePos: number;
  //     roomNum: number;
  //   },
  // ) {
  //   let paddleDelta;
  //   if (roomManager.has(content.roomNum)) {
  //     const gameData = roomManager.get(content.roomNum);
  //     if (content.userLocation == 1) {
  //       paddleDelta = gameData.leftPaddle - content.paddlePos;
  //       gameData.leftPaddle = content.paddlePos;
  //     } else {
  //       paddleDelta = gameData.rightPaddle - content.paddlePos;
  //       gameData.rightPaddle = content.paddlePos;
  //     }
  //     if (paddleDelta < 0) {
  //       paddleDelta *= -1;
  //     }

  //     gameData.advance(paddleDelta);

  //     if (
  //       (gameData.score[0] === finishScore || gameData[1] === finishScore) &&
  //       gameData.onGame
  //     ) {
  //       this.server
  //         .to(String(content.roomNum))
  //         .emit('finished', gameData.score);
  //       gameData.onGame = false;
  //       await this.pushHistory(content.roomNum, gameData.mode);
  //       await this.gameResultProcess(gameData, content.roomNum);
  //       gameData.score = [0, 0];
  //       // 일반게임이면 레디상태 초기화
  //       if (content.roomNum % 2 === 0) {
  //         checkReady.get(content.roomNum)[0] = false;
  //         checkReady.get(content.roomNum)[1] = false;
  //       }
  //     } else if (gameData.onGame === false) {
  //       client.emit('finished', gameData.score);
  //     } else {
  //       this.server.to(String(content.roomNum)).emit('gameData', gameData);
  //     }
  //   }
  // }
}
