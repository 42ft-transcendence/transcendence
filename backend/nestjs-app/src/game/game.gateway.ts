import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { TMP, UserStatusType } from 'src/util';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MatchHistorysService } from 'src/match_history/history.service';
import { HistoryDto } from 'src/match_history/dto/history.dto';
import { GameService } from './game.service';
import { SHA256 } from 'crypto-js';
import { GameRoom, GameRoomStatus, GameRoomType } from './game.room';

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
  ) {}

  @WebSocketServer()
  server: Server;

  private findGameRoomByURL(roomURL: string): GameRoom | undefined {
    return this.gameService
      .getAllGameRooms()
      .find((room) => room.roomURL === roomURL);
  }

  refreshGameRoomList() {
    this.server.emit('roomList', this.gameService.getAllGameRoomsInfo());
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
      const newRoomData = {
        roomURL: SHA256(new Date() + user1.id + user2.id).toString(),
        roomName: '랭킹전',
        roomType: 'RANKING' as GameRoomType,
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
        countsOfDisconnect: 0,
        onGame: [false, false],
        timeout: null,
        gameEngine: null,
      };
      const newRoom = new GameRoom(newRoomData, this, this.gameService);
      this.gameService.createGameRoom(newRoom);
      const response = {
        gameRoomURL: newRoom.roomURL,
        gameRoom: newRoom.getGameRoomInfo(),
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
    const newRoomData = {
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
    // GameRoom 인스턴스 생성
    const newRoom = new GameRoom(newRoomData, this, this.gameService);
    this.gameService.createGameRoom(newRoom);
    await this.userService.updateStatus(content.myData, UserStatusType.GAME);
    this.server.emit('offerBattle', content);
  }

  @SubscribeMessage('createGameRoom')
  async createGameRoom(
    client: Socket,
    content: { user: User; gameRoomURL: string },
  ) {
    const newRoomData = {
      roomURL: content.gameRoomURL,
      roomName: '',
      roomType: 'PUBLIC' as GameRoomType,
      roomPassword: '',
      roomOwner: content.user,
      numberOfParticipants: 1,
      gameMode: 'NORMAL',
      map: 'NORMAL',
      participants: [{ user: content.user, ready: false }],
      status: GameRoomStatus.WAITING,
    };

    // GameRoom 인스턴스 생성
    const newRoom = new GameRoom(newRoomData, this, this.gameService);

    // Note: gameService의 createGameRoom 메서드가 GameRoom 인스턴스를 받아야 한다면 아래와 같이 변경됩니다.
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
  }

  @SubscribeMessage('acceptBattle')
  async acceptBattle(
    client: Socket,
    content: { gameRoomURL: string; user1Id: string; user2Id: string },
  ) {
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    const response = {
      gameRoomURL: content.gameRoomURL,
      gameRoom: gameRoom.getGameRoomInfo(),
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
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.setParticipantReady(content.userId, true);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('readyCancleGameRoom')
  readyCancleGameRoom(
    client: Socket,
    content: { gameRoomURL: string; userId: string },
  ) {
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.setParticipantReady(content.userId, false);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('enterGameRoom')
  async enterGameRoom(
    client: Socket,
    content: { gameRoomURL: string; user: User },
  ) {
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.enterGameRoom(content.user);
    await this.userService.updateStatus(content.user, UserStatusType.GAME);
    this.refreshGameRoomList();
  }

  @SubscribeMessage('exitGameRoom')
  async exitGameRoom(
    client: Socket,
    content: { gameRoomURL: string; user: User },
  ) {
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.exitGameRoom(content.user);
    if (gameRoom.numberOfParticipants === 0) {
      this.gameService.deleteGameRoom(content.gameRoomURL);
      if (content.user.status === UserStatusType.GAME) {
        await this.userService.updateStatus(
          content.user,
          UserStatusType.ONLINE,
        );
      }
    }
    this.refreshGameRoomList();
  }

  @SubscribeMessage('startGameCountDown')
  async startGameCountDown(client: Socket, content: { gameRoomURL: string }) {
    for (let secondsRemaining = 5; secondsRemaining >= -1; secondsRemaining--) {
      if (secondsRemaining !== -1)
        this.sendCountDownMessage(content.gameRoomURL, secondsRemaining);
      else this.startGame(client, content);
      await this.wait(1000);
    }
  }

  private sendCountDownMessage(roomURL: string, seconds: number) {
    const message =
      seconds > 0
        ? `게임 시작까지 ${seconds}초 남았습니다.`
        : '게임이 시작됩니다!';
    const response = {
      roomURL: roomURL,
      roomName: 'SYSTEM',
      message: message,
      userId: 'SYSTEM',
      userNickname: 'SYSTEM',
      createdAt: new Date(),
    };
    this.server.emit('getGameRoomChat', response);
  }

  private wait(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  startGame(client: Socket, content: { gameRoomURL: string }) {
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.startGame();
  }

  @SubscribeMessage('surrenderGame')
  surrenderGame(
    client: Socket,
    content: { gameRoomURL: string; userId: string },
  ) {
    console.log('surrenderGame: ', content);
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.surrenderGame(content.userId);
  }

  @SubscribeMessage('userPaddle')
  userPaddle(
    client: Socket,
    content: { gameRoomURL: string; userIndex: number; userPaddle: number },
  ) {
    const gameRoom = this.findGameRoomByURL(content.gameRoomURL);
    if (!gameRoom) return;
    gameRoom.userPaddle(content);
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

  makeMatchHistory(historyDto: HistoryDto) {
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
    try {
      const userId = await this.getUserId(client);
      const gameRoom = this.gameService
        .getAllGameRooms()
        .find((room) =>
          room.participants.find(
            (participant) => participant.user.id === userId,
          ),
        );
      if (!gameRoom) return;
      if (gameRoom.status === GameRoomStatus.GAMING) {
        gameRoom.connection(userId);
      }
    } catch (e) {
      console.log(e);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = await this.getUserId(client);
    const gameRoom = this.gameService
      .getAllGameRooms()
      .find((room) =>
        room.participants.find((participant) => participant.user.id === userId),
      );
    if (!gameRoom) return;
    if (gameRoom.status === GameRoomStatus.GAMING) {
      gameRoom.disconnection(userId);
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
      throw new Error('Invalid Token');
    }
  }
}
