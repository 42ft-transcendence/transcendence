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
  async acceptBattle(client: Socket, content: { gameRoomURL: string }) {
    const gameRoom = this.gameService.getAllGameRooms().find((room) => {
      return room.roomURL === content.gameRoomURL;
    });
    console.log('acceptBattle: ', gameRoom);
    const response = {
      gameRoomURL: content.gameRoomURL,
      gameRoom: gameRoom,
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
        message: i > 0 ? `게임 시작까지 ${i}초` : '게임이 시작됩니다!',
        userId: 'SYSTEM',
        userNickname: 'SYSTEM',
        createdAt: new Date(),
      };

      // 카운트다운 메시지 발송
      if (i !== -1) {
        this.server.emit('getGameRoomChat', response);
      } else {
        const newEngine = new GameData();
        roomManager.set(content.gameRoomURL, newEngine);
        const startGameResponse = {
          gameRoomURL: content.gameRoomURL,
          gameData: roomManager.get(content.gameRoomURL),
        };
        this.server.emit('startGame', startGameResponse);
      }
      // 1초 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  @SubscribeMessage('startGameTest')
  startGameTest(client: Socket, content: { gameRoomURL: string }) {
    const newEngine = new GameData();
    roomManager.set(content.gameRoomURL, newEngine);
    const response = {
      gameRoomURL: content.gameRoomURL,
      gameData: roomManager.get(content.gameRoomURL),
    };
    this.server.emit('startGame', response);
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
    const response = {
      gameRoomURL: content.gameRoomURL,
      userIndex: content.userIndex,
      gameData: engine,
    };
    this.server.emit('gameProcess', response);
    this.server.emit('gameScore', {
      gameRoomURL: content.gameRoomURL,
      user1Score: engine.score[0],
      user2Score: engine.score[1],
    });
    if (engine.score[0] >= 5 || engine.score[1] >= 5) {
      const finishedResponse = {
        gameRoomURL: content.gameRoomURL,
        winner: engine.score[0] > engine.score[1] ? 0 : 1,
      };
      this.gameService.deleteGameRoom(content.gameRoomURL);
      roomManager.delete(content.gameRoomURL);
      this.server.emit('finishedRankGame', finishedResponse);
      return;
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
