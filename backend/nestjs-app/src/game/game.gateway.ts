import {
  ConnectedSocket,
  MessageBody,
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
import { HistoryDto } from 'src/match_history/history.dto';
import { GameData } from './game.engine';

let rankRoom = 0;
let normalRoom = 1;
const finishScore = 5;

const roomManager = new Map<number, GameData>();
const roomList = new Map<number, RoomData>();
const getPlayerWithRoomnum = new Map<number, [string, string]>();
const getRoomNumWithID = new Map<string, number>();
const getUser = new Map<number, [User, User]>();
const getUserList = new Map<number, User[]>();
const checkReady = new Map<number, [boolean, boolean]>();
const checkStart = new Map<number, [boolean, boolean]>();

@WebSocketGateway({
  middlewares: [],
  namespace: '/game',
})
export class GameGateway {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private matchHistorysService: MatchHistorysService,
    private rootGateway: ChattingGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  /*
    ========== 서버연결,서버 연결 해제 관련 핸들러 =========
  async offerGame(user_id: string, awayUser: User): Promise<boolean> {
    const user = await this.userService.getUserById(user_id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const content = {
        user_id: user_id,
        awayUser: awayUser,
      };
      this.server.emit('offerGame', content);
      return true;
    }
  }

    handleConnection : 유저가 연결되면 호출되는 핸들러
    hadleDisconnect : 유저가 연결이 끊어졌을 때 호출되는 핸들러
    disconnectProcess : 유저가 연결이 끊어졌을 때 진행하는 전체 처리 과정
    ConfiscationProcess : 게임 중 유저가 연결이 끊어졌을 때 몰수 처리를 진행하는 함수
    deleteProcess : 연결 종료 및 관련 처리 함수
  */

  /**
   * 유저가 연결되면 호출되는 핸들러
   * @param {Socket} client - 연결된 클라이언트 소켓
   */
  async handleConnection(@ConnectedSocket() client) {
    // 클라이언트로부터 유저 ID를 가져오기
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    console.log('connect game : ' + user.nickname);
  }

  /**
   * 클라이언트의 연결이 끊어졌을 때 실행되는 처리 함수
   * @param {Socket} client - 클라이언트 소켓
   * @returns {Promise<void>}
   */
  async handleDisconnect(@ConnectedSocket() client) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    console.log('leave game : ', user.nickname);
    const roomNum = getRoomNumWithID.get(user.id);

    // 연결이 끊긴 유저가 플레이어였을 경우만 추가 처리
    if (roomNum != undefined) {
      getRoomNumWithID.delete(user.id);

      const connectedNickName = user.nickname;
      let userLeft = '';
      let userright = '';
      await this.userService.updateStatus(user, UserStatusType.ONLINE);
      const findIndex = getUserList
        .get(roomNum)
        .findIndex((item) => item.id === user.id);
      if (findIndex !== -1) getUserList.get(roomNum).splice(findIndex, 1);
      this.server.to(roomNum.toString()).emit('AllUserList', {
        data: getUserList.get(roomNum),
      });
      if (getPlayerWithRoomnum.has(roomNum)) {
        userLeft = getPlayerWithRoomnum.get(roomNum)[0];
        userright = getPlayerWithRoomnum.get(roomNum)[1];
      }

      if (connectedNickName == userLeft || connectedNickName == userright) {
        await this.disconnectProcess(
          client,
          roomNum,
          userLeft,
          userright,
          connectedNickName,
        );
      }
    }
  }
  /**
   * 유저가 연결이 끊어졌을 때 진행하는 전체 처리 과정
   * 이 함수에서는 몰수 처리 후 방 정보를 삭제하는 처리까지 진행된다.
   */
  async disconnectProcess(
    @ConnectedSocket() client,
    roomNum: number,
    userLeft: string,
    userright: string,
    connectedNickName: string,
  ) {
    await this.ConfiscationProcess(
      roomNum,
      userLeft,
      userright,
      connectedNickName,
    );
    await this.deleteProcess(
      client,
      roomNum,
      userLeft,
      userright,
      connectedNickName,
    );
  }

  /**
   * 게임 중 유저가 연결이 끊어졌을 때 몰수 처리를 진행하는 함수
   * @param {number} roomNum - 방 번호
   * @param {string} userLeft - 왼쪽 유저 이름
   * @param {string} userright - 오른쪽 유저 이름
   * @param {string} connectedNickName - 연결 끊긴 유저의 닉네임
   */
  async ConfiscationProcess(
    roomNum: number,
    userLeft: string,
    userright: string,
    connectedNickName: string,
  ) {
    const gameData = roomManager.get(roomNum);

    // 게임 중일 때만 몰수 처리
    if (gameData.onGame) {
      gameData.onGame = false;
      if (connectedNickName == userLeft) {
        gameData.score = [0, finishScore + 1];
      } else if (connectedNickName == userright) {
        gameData.score = [finishScore + 1, 0];
      }
      this.server.to(roomNum.toString()).emit('finished', gameData.score);
      await this.pushHistory(roomNum, gameData.mode);
      await this.gameResultProcess(gameData, roomNum);
      gameData.score = [0, 0];
      gameData.reset();
      if (roomNum % 2) {
        checkReady.get(roomNum).fill(false);
      }
    }
  }

  /**
   * 연결 종료 및 관련 처리 함수
   * @param {Socket} client - 클라이언트 소켓
   * @param {number} roomNum - 방 번호
   * @param {string} userLeft - 왼쪽 유저 이름
   * @param {string} userright - 오른쪽 유저 이름
   * @param {string} connectedNickName - 연결된 유저의 닉네임
   */
  async deleteProcess(
    @ConnectedSocket() client,
    roomNum: number,
    userLeft: string,
    userright: string,
    connectedNickName: string,
  ) {
    const user_id = await this.getUserId(client);
    if (roomList.has(roomNum)) {
      roomList.get(roomNum).person--;
      roomList.get(roomNum).participation = true;
    }
    // 유저 닉네임이 왼쪽 유저와 일치하는 경우
    if (connectedNickName == userLeft) {
      getPlayerWithRoomnum.get(roomNum)[0] = '';
      // 일반 게임 방인 경우 준비 상태 초기화
      if (roomNum % 2) {
        checkReady.get(roomNum).fill(false);
        checkStart.get(roomNum).fill(false);
        this.server
          .to(roomNum.toString())
          .emit('usersReadySet', checkReady.get(roomNum));
      }
    }
    // 유저 닉네임이 오른쪽 유저와 일치하는 경우
    else if (connectedNickName == userright) {
      getPlayerWithRoomnum.get(roomNum)[1] = '';
      if (roomNum % 2) {
        checkReady.get(roomNum).fill(false);
        checkStart.get(roomNum).fill(false);
        this.server
          .to(roomNum.toString())
          .emit('usersReadySet', checkReady.get(roomNum));
      }
    }

    this.server
      .to(roomNum.toString())
      .emit('allUserSet', await this.checkUserSet(roomNum));

    client.leave(roomNum.toString());

    // 둘 다 플레이어가 없는 경우 데이터 삭제
    if (
      getPlayerWithRoomnum.get(roomNum)[0] == '' &&
      getPlayerWithRoomnum.get(roomNum)[1] == ''
    ) {
      getPlayerWithRoomnum.delete(roomNum);
      roomManager.delete(roomNum);
      getUser.delete(roomNum);
      roomList.delete(roomNum);
      checkStart.delete(roomNum);
      if (roomNum % 2) {
        checkReady.delete(roomNum);
      }
    }
    this.server.emit('roomList', JSON.stringify(Array.from(roomList)));
  }

  //////////////////////////////////////////////////////////////////////

  /*
      ========== 게임 결과 처리 핸들러 =========
      pushHistory : 게임 히스토리를 저장하는 함수
      gameResultProcess : 게임 결과 처리 함수
      updateGameInfo : 유저의 게임 정보를 업데이트 하는 함수
      */

  /**
   * 게임 히스토리를 저장하는 함수
   * @param {number} roomNumber - 방 번호
   * @param {number} mode - 게임 모드
   */
  async pushHistory(roomNumber: number, mode: number) {
    let gameModeselector: string;

    // 게임 모드에 따른 문자열 설정
    if (mode == 0) {
      gameModeselector = '랭크';
    } else if (mode == 1) {
      gameModeselector = '일반';
    } else if (mode == 2) {
      gameModeselector = '일반-포탈';
    } else {
      gameModeselector = 'unknown';
    }

    // 히스토리 데이터 생성
    const historyDtoTmp: HistoryDto = {
      player1score: roomManager.get(roomNumber).score[0],
      player2score: roomManager.get(roomNumber).score[1],
      player1: '',
      player2: '',
      gameMode: gameModeselector,
    };

    // 히스토리 데이터 저장
    this.matchHistorysService.putHistory(
      historyDtoTmp,
      getUser.get(roomNumber)[0],
      getUser.get(roomNumber)[1],
    );

    console.log('add history');
  }

  /**
   * 유저의 게임 정보를 업데이트 하는 함수
   * @param {User} user - 정보를 업데이트 할 유저
   * @param {number} WinLose - 게임 승패 정보 (양수이면 승, 음수면 패)
   * @param {number} isRank - 게임이 랭크게임인지 아닌지를 나타냄 (0이면 랭크, 그 외는 일반)
   * @param {number} changeRating - 랭크 게임일 경우 변경된 레이팅
   */

  async updateGameInfo(
    user: User,
    WinLose: number,
    isRank: number,
    changeRating: number,
  ) {
    user = await this.userService.getUserById(user.id);
    if (isRank == 0) {
      user.rating += changeRating;
      if (WinLose > 0) {
        user.ladder_win++;
      } else {
        user.ladder_lose++;
      }
      await this.userService.updateLadderGameRecord(user);
    } else {
      if (WinLose > 0) {
        user.win++;
      } else {
        user.lose++;
      }
      await this.userService.updateNormalGameRecord(user);
    }
    console.log('updat user info');
  }

  async gameResultProcess(gameData: GameData, room: number) {
    const winLose = gameData.score[0] - gameData.score[1];
    const isRank = room % 2;
    const user = getUser.get(room);
    const K = 32;
    const expectedScore = (ratingA: number, ratingB: number): number =>
      1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const calculateScore = (expected: number, actual: number): number =>
      K * (actual - expectedScore(user[0].rating, user[1].rating));
    const user0ChangeRating = calculateScore(
      expectedScore(user[0].rating, user[1].rating),
      winLose > 0 ? 1 : 0,
    );
    const user1ChangeRating = calculateScore(
      expectedScore(user[1].rating, user[0].rating),
      winLose > 0 ? 1 : 0,
    );

    await this.updateGameInfo(user[0], winLose, isRank, user0ChangeRating);
    await this.updateGameInfo(user[1], winLose * -1, isRank, user1ChangeRating);
  }

  ////////////////////////////////////////////////////////////////////////

  /*
      ========== 실시간 게임 중 데이터 실시간 통신 핸들러 =========
      sendGameData : 게임 데이터를 전달하는 함수
      giveupGame : 게임 포기를 처리하는 함수
      normalBattle : 일반 게임을 처리하는 함수
      rankBattle : 랭크 게임을 처리하는 함수
      */

  /**기권. 방 번호 주는게 좋음*/
  @SubscribeMessage('giveUpGame')
  async giveUpGame(@ConnectedSocket() client, @MessageBody() roomNum: number) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    // const roomNum = getRoomNumWithNick.get(user.nickname);
    const players = getPlayerWithRoomnum.get(roomNum);

    await this.ConfiscationProcess(
      roomNum,
      players[0],
      players[1],
      user.nickname,
    );
  }

  /**
   * 일반 배틀 시작 핸들러.
   * 일반 배틀을 시작하면 이 핸들러가 처리합니다.
   * @param {Socket} client - 클라이언트 소켓
   * @returns {Promise<void>}
   *
   */
  @SubscribeMessage('normalBattle')
  async normalBattle(@ConnectedSocket() client) {
    // 사용자의 ID를 가져옴
    const user_id = await this.getUserId(client);
    // 위에서 가져온 ID를 사용하여 사용자의 정보를 가져옴
    const user = await this.userService.getUserById(user_id);
    // 해당 사용자의 방 번호를 가져옴
    const ownRoomNum: number = getRoomNumWithID.get(user.id);

    // 사용자의 상태를 GAME으로 변경
    await this.userService.updateStatus(user, UserStatusType.GAME);

    // 사용자 리스트에 현재 방 번호가 없다면 새로운 사용자 배열을 생성하여 추가
    if (!getUserList.has(ownRoomNum)) {
      getUserList.set(ownRoomNum, new Array<User>());
    }
    // 현재 접속한 사용자를 방의 사용자 목록에 추가
    getUserList.get(ownRoomNum).push(user);

    // 현재 접속한 클라이언트를 소켓의 방에 연결
    client.join(ownRoomNum.toString());
    // 해당 방의 모든 사용자에게 현재 방의 사용자 목록을 전송
    this.server.to(ownRoomNum.toString()).emit('AllUserList', {
      data: getUserList.get(ownRoomNum),
    });

    // 방의 첫 번째 사용자가 없다면
    if (getPlayerWithRoomnum.get(ownRoomNum)[0] == '') {
      // 현재 사용자를 방의 첫 번째 사용자로 설정
      getPlayerWithRoomnum.get(ownRoomNum)[0] = user.nickname;
      getUser.get(ownRoomNum)[0] = user;

      // 첫 번째 사용자에게 패들 정보를 전송
      client.emit('getPaddle', [
        1,
        ownRoomNum,
        roomManager.get(ownRoomNum).mode,
      ]);

      // 해당 방의 모든 사용자에게 방의 사용자 닉네임 목록을 전송
      this.server
        .to(ownRoomNum.toString())
        .emit('getPlayers', getPlayerWithRoomnum.get(ownRoomNum));

      // 해당 방의 모든 사용자에게 모든 사용자가 준비되었는지 확인한 결과를 전송
      this.server
        .to(ownRoomNum.toString())
        .emit('allUserSet', await this.checkUserSet(ownRoomNum));
    }
    // 방의 두 번째 사용자가 없다면
    else if (getPlayerWithRoomnum.get(ownRoomNum)[1] == '') {
      // 현재 사용자를 방의 두 번째 사용자로 설정
      getPlayerWithRoomnum.get(ownRoomNum)[1] = user.nickname;
      getUser.get(ownRoomNum)[1] = user;

      // 두 번째 사용자에게 패들 정보를 전송
      client.emit('getPaddle', [
        2,
        ownRoomNum,
        roomManager.get(ownRoomNum).mode,
      ]);

      // 해당 방의 모든 사용자에게 방의 사용자 닉네임 목록을 전송
      this.server
        .to(ownRoomNum.toString())
        .emit('getPlayers', getPlayerWithRoomnum.get(ownRoomNum));

      // 해당 방의 모든 사용자에게 모든 사용자가 준비되었는지 확인한 결과를 전송
      this.server
        .to(ownRoomNum.toString())
        .emit('allUserSet', await this.checkUserSet(ownRoomNum));
    }
    // 위의 두 조건에 모두 해당되지 않는 경우 (첫 번째, 두 번째 사용자가 모두 존재하는 경우)
    else {
      // 세 번째 사용자에게 패들 정보를 전송
      client.emit('getPaddle', [
        3,
        ownRoomNum,
        roomManager.get(ownRoomNum).mode,
      ]);

      // 현재 사용자에게 방의 사용자 닉네임 목록을 전송
      client.emit('getPlayers', getPlayerWithRoomnum.get(ownRoomNum));
      // 현재 사용자에게 사용자들의 준비 상태를 전송
      client.emit('usersReadySet', checkReady.get(ownRoomNum));

      // 현재 사용자에게 모든 사용자가 준비되었는지 확인한 결과를 전송
      client.emit('allUserSet', await this.checkUserSet(ownRoomNum));
    }
  }

  /**
   * 랭크 배틀 핸들러.
   * 유저가 랭크 배틀을 요청하면 이 핸들러가 처리합니다.
   * @param {Socket} client - 클라이언트 소켓
   * @returns {Promise<void>}
   */
  @SubscribeMessage('rankBattle')
  async rankBattle(@ConnectedSocket() client: any) {
    // 사용자의 ID와 정보를 가져옵니다.
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);

    // 사용자의 상태를 게임 중으로 변경합니다.
    await this.userService.updateStatus(user, UserStatusType.GAME);

    // 해당 방에 게임 참여 유저 목록을 업데이트합니다.
    if (!getUserList.has(rankRoom)) {
      getUserList.set(rankRoom, new Array<User>());
    }
    getUserList.get(rankRoom).push(user);

    // 클라이언트를 socket room에 연결합니다.
    client.join(rankRoom.toString());
    this.server.to(rankRoom.toString()).emit('AllUserList', {
      data: getUserList.get(rankRoom),
    });

    if (getPlayerWithRoomnum.get(rankRoom) == undefined) {
      // 방에 첫번째로 입장한 유저일 경우

      // 방 정보와 사용자 정보를 업데이트합니다.
      getPlayerWithRoomnum.set(rankRoom, [user.nickname, '']);
      getRoomNumWithID.set(user.id, rankRoom);
      getUser.set(rankRoom, [user, undefined]);

      // 게임 시작 체크를 설정합니다.
      checkStart.set(rankRoom, [false, false]);

      // 유저에게 paddle 번호와 방 정보를 전달합니다.
      client.emit('getPaddle', [1, rankRoom, 0]);

      // 새 게임 데이터 객체를 생성하여 방 매니저에 추가합니다.
      const tmp = new GameData();
      roomManager.set(rankRoom, tmp);
    } else {
      // 방에 두번째로 입장한 유저일 경우

      getUser.get(rankRoom)[1] = user;

      // 유저에게 paddle 번호를 전달합니다.
      client.emit('getPaddle', [2, rankRoom, 0]);

      // 방 정보와 사용자 정보를 업데이트합니다.
      getPlayerWithRoomnum.get(rankRoom)[1] = user.nickname;
      getRoomNumWithID.set(user.id, rankRoom);

      // 모든 유저에게 참가한 닉네임 정보를 전달합니다.
      this.server
        .to(rankRoom.toString())
        .emit('getPlayers', getPlayerWithRoomnum.get(rankRoom));

      // 게임 시작 상태를 업데이트합니다.
      roomManager.get(rankRoom).onGame = true;

      this.server
        .to(rankRoom.toString())
        .emit('allUserSet', await this.checkUserSet(rankRoom));

      // 다음 랭크 게임을 위해 rankRoom 값을 2 증가시킵니다.
      rankRoom += 2;
    }
  }

  ////////////////////////////////////////////////////////////////////
  /*
      ========== 게임 방 관련 핸들러 =========
      startGame : 게임 시작을 처리하는 함수
      ReadyCancel : 게임 준비 취소를 처리하는 함수
      setReady : 게임 준비를 처리하는 함수
      changeMode : 게임 모드를 변경하는 함수
      requestRoomList : 게임 방 목록을 요청하는 함수
      enterRoom : 게임 방에 입장하는 함수
      makeRoom : 게임 방을 생성하는 함수
      */

  /**
   * 'startGame' 메시지를 구독하여 두 사용자의 게임 시작 신호를 확인합니다.
   * 모든 사용자가 시작을 준비했을 때 게임을 시작합니다.
   *
   * @param client 현재 연결된 소켓 클라이언트
   * @param data 배열로, [방 번호, 사용자 번호] 형태로 전달됩니다.
   */
  @SubscribeMessage('startGame')
  async startGame(
    @ConnectedSocket() client,
    @MessageBody() data: [number, number],
  ) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    const roomNum = data[0];

    // 시작 준비한 사용자 번호에 따라 해당 사용자의 시작 준비 상태를 설정합니다.
    if (data[1] == 1) {
      checkStart.get(roomNum)[0] = true;
    } else if (data[1] == 2) {
      checkStart.get(roomNum)[1] = true;
    }

    roomManager.get(roomNum).onGame = true;

    // 두 사용자 모두 시작 준비 상태라면 실제 게임을 시작합니다.
    if (checkStart.get(roomNum)[0] && checkStart.get(roomNum)[1]) {
      this.server.to(roomNum.toString()).emit('startBattle', {
        nicks: getPlayerWithRoomnum.get(roomNum),
        roomNum: roomNum,
        users: getUser.get(roomNum),
      });

      // 시작 준비 상태 초기화
      checkStart.get(roomNum)[0] = false;
      checkStart.get(roomNum)[1] = false;
    }
  }

  /**
   * 'ReadyCancel' 메시지를 구독하여 사용자의 준비 취소 상태를 설정합니다.
   *
   * @param client 현재 연결된 소켓 클라이언트
   * @param roomNum 사용자가 위치한 방 번호
   */
  @SubscribeMessage('ReadyCancel')
  async ReadyCancel(@ConnectedSocket() client, @MessageBody() roomNum: number) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    const players = getPlayerWithRoomnum.get(roomNum);

    // 현재 사용자가 방의 첫 번째 플레이어라면 준비 취소 상태로 변경합니다.
    if (players[0] == user.nickname) {
      checkReady.get(roomNum)[0] = false;
    }
    // 현재 사용자가 방의 두 번째 플레이어라면 준비 취소 상태로 변경합니다.
    else if (players[1] == user.nickname) {
      checkReady.get(roomNum)[1] = false;
    }

    // 모든 사용자의 준비 상태를 방에 있는 모든 클라이언트에게 전송합니다.
    this.server
      .to(roomNum.toString())
      .emit('usersReadySet', checkReady.get(roomNum));
  }

  /**
   * 'setReady' 메시지를 구독하여 사용자의 준비 상태를 설정합니다.
   *
   * @param client 현재 연결된 소켓 클라이언트
   * @param roomNum 사용자가 위치한 방 번호
   */
  @SubscribeMessage('setReady')
  async setReady(@ConnectedSocket() client, @MessageBody() roomNum: number) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    const players = getPlayerWithRoomnum.get(roomNum);

    // 현재 사용자가 방의 첫 번째 플레이어라면 준비 상태로 변경합니다.
    if (players[0] == user.nickname) {
      checkReady.get(roomNum)[0] = true;
    }
    // 현재 사용자가 방의 두 번째 플레이어라면 준비 상태로 변경합니다.
    else if (players[1] == user.nickname) {
      checkReady.get(roomNum)[1] = true;
    }

    // 모든 사용자의 준비 상태를 방에 있는 모든 클라이언트에게 전송합니다.
    this.server
      .to(roomNum.toString())
      .emit('usersReadySet', checkReady.get(roomNum));

    // 두 사용자 모두 준비 상태라면 게임 시작을 알리는 'allReady' 이벤트를 전송합니다.
    if (checkReady.get(roomNum)[0] && checkReady.get(roomNum)[1]) {
      roomManager.get(roomNum).onGame = true;
      this.server.to(roomNum.toString()).emit('allReady');
    }
  }

  /**일반게임 게임모드 바꾸는 이벤트 */
  @SubscribeMessage('changeMode')
  async changeMode(@MessageBody() data: [number, number]) {
    roomManager.get(data[0]).mode = data[1];
    this.server.to(data[0].toString()).emit('modeChanged', data[1]);
  }

  /**client의 room list 요청 이벤트. */
  @SubscribeMessage('requestRoomList')
  async requestRoomList(@ConnectedSocket() client) {
    client.emit('roomList', JSON.stringify(Array.from(roomList)));
  }

  /**방 입장 버튼 클릭 시 입장 요청 */
  @SubscribeMessage('enterRoom')
  async enterRoom(
    @ConnectedSocket() client,
    @MessageBody()
    data: [number, string],
  ) {
    /**data [roomNum, pass] */
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    if (roomList.has(data[0])) {
      const room = roomList.get(data[0]);

      if (room.pass == '' || (await bcrypt.compare(data[1], room.pass))) {
        getRoomNumWithID.set(user.id, data[0]);
        room.person++;
        room.participation = false;
        this.server.emit('roomList', JSON.stringify(Array.from(roomList)));

        client.emit('passSuccess');
      } else {
        client.emit('passError');
      }
    } else {
      client.emit('noRoom');
    }
  }

  /**client의 방 생성 요청 */
  @SubscribeMessage('submitRoomData')
  async makeRoom(
    @ConnectedSocket() client,
    @MessageBody()
    data: RoomData,
  ) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);

    const roomNumTmp = normalRoom;
    normalRoom += 2;

    this.normalRoomSettings(roomNumTmp, user, data.mode);

    /**받아온 data를 id(방번호)만 수정하여 그대로 사용 가능 할 듯 */
    const roomData: RoomData = {
      name: data.name,
      pass: data.pass,
      mode: data.mode,
      person: 1,
      id: roomNumTmp,
      secret: data.secret,
      participation: true,
    };
    const salt = await bcrypt.genSalt();
    roomData.pass = await bcrypt.hash(data.pass, salt);
    roomList.set(roomNumTmp, roomData);

    /**생성된 room 포함된 list client측 정보 갱신. */
    this.server.emit('roomList', JSON.stringify(Array.from(roomList)));

    client.emit('done');
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  /*
      ========== 게임 신청, 수락 관련 핸들러 =========
      offerGame : 게임 제안을 처리하는 함수
      acceptBattle : 게임 수락을 처리하는 함수
      rejectBattle : 게임 거절을 처리하는 함수
      */

  /**
   * 게임 제안 기능
   * @param {string} user_id - 유저의 아이디
   * @param {User} awayuser - 유저의 닉네임
   * @returns {Promise<boolean>} - 게임 제안이 성공하면 true를 반환
   */
  async offerGame(user_id: string, awayuser: User): Promise<boolean> {
    // 유저 정보를 ID로 가져오기
    const user = await this.userService.getUserById(user_id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const content = {
        user_id: user_id,
        away_user: awayuser,
      };
      // 게임 제안 이벤트 발행
      this.server.emit('offerGame', content);
      return true;
    }
  }

  /**
   * 대결 요청을 수락하는 핸들러.
   * 유저가 대결 요청을 수락하면, 해당 유저를 방에 참가시키고, 방 정보를 업데이트합니다.
   * @param {Socket} client - 클라이언트 소켓
   * @returns {Promise<void>}
   */
  @SubscribeMessage('acceptBattle')
  async acceptBattle(@ConnectedSocket() client) {
    // 현재 클라이언트의 사용자 ID를 가져옵니다.
    const user_id = await this.getUserId(client);
    // 해당 ID의 사용자 정보를 가져옵니다.
    const user = await this.userService.getUserById(user_id);

    // 참가할 방의 정보와 상대방의 닉네임을 가져옵니다.
    const right = user.nickname;
    const roomNum = getRoomNumWithID.get(user.id);

    // 방에 이미 한 명의 플레이어가 있다면, 이 사용자를 두 번째 플레이어로 등록합니다.
    if (
      getPlayerWithRoomnum.has(roomNum) &&
      getPlayerWithRoomnum.get(roomNum)[0] != ''
    ) {
      const left = getPlayerWithRoomnum.get(roomNum)[0];
      // 방 정보를 생성합니다.
      const roomData: RoomData = {
        name: left + ' vs ' + right,
        pass: '',
        mode: roomManager.get(roomNum).mode,
        person: 2,
        id: roomNum,
        secret: false,
        participation: false,
      };
      // 방 리스트에 방 정보를 업데이트합니다.
      roomList.set(roomNum, roomData);
      // 클라이언트에게 대결이 시작됨을 알립니다.
      client.emit('vsbattle');
      // 전체 서버에게 방 리스트 정보를 업데이트하여 전달합니다.
      this.server.emit('roomList', JSON.stringify(Array.from(roomList)));
    } else {
      // 대결을 시작할 수 없는 경우, 방 정보를 삭제하고 알림을 보냅니다.
      getRoomNumWithID.delete(user.id);
      client.emit('canNotAvailableGame');
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  /*
      ========== 유틸 함수 ===========
      getUserId : 클라이언트 소켓에서 jwt 토큰을 파싱하여 유저 아이디를 추출하는 함수
      checkUserSet : 유저 설정 상태를 체크하는 함수
      normalRoomSettings : 일반 게임 방 설정을 초기화하는 함수
      checkAvailableGame : 유저가 게임을 할 수 있는지 체크하는 함수
      statusHandler : 유저 상태를 업데이트하는 함수
  */
  /**
   * 클라이언트 소켓에서 jwt 토큰을 파싱하여 유저 아이디를 추출하는 함수
   * @param {Socket} client - 클라이언트 소켓
   * @returns {Promise<string>} - 유저 아이디
   */
  private async getUserId(@ConnectedSocket() client) {
    try {
      let haha = String(client.handshake.headers.authorization);
      haha = haha.replace('Bearer ', '');
      const user: TMP = await this.authService.jwtVerify(haha);
      return user.id;
    } catch (e) {}
  }
  /**
   * 유저 설정 상태 체크 함수
   * @param {number} roomNum - 방 번호
   * @returns {Promise<[boolean, boolean]>} - 각 유저의 설정 상태를 boolean 배열로 반환
   */
  async checkUserSet(roomNum: number): Promise<[boolean, boolean]> {
    const tmp = getPlayerWithRoomnum.get(roomNum);
    const result: [boolean, boolean] = [false, false];
    result[0] = tmp[0] != '';
    result[1] = tmp[1] != '';

    return result;
  }

  normalRoomSettings(roomNum: number, user: User, mode: number) {
    getPlayerWithRoomnum.set(roomNum, ['', '']);
    getRoomNumWithID.set(user.id, roomNum);
    getUser.set(roomNum, [undefined, undefined]);
    checkReady.set(roomNum, [false, false]);
    checkStart.set(roomNum, [false, false]);

    const gameTemp: GameData = new GameData();
    gameTemp.mode = mode;
    roomManager.set(roomNum, gameTemp);
  }

  checkAvailableGame(user: User): boolean {
    console.log('checkAvailableGame: ', getRoomNumWithID.has(user.id));
    if (getRoomNumWithID.has(user.id)) {
      return false;
    }
    return true;
  }

  /**
   * 유저 상태 업데이트 핸들러
   * @param {User} user - 상태를 변경할 유저
   * @param {UserStatusType} type - 변경할 상태 타입
   */
  async statusHandler(user: User, type: UserStatusType) {
    await this.userService.updateStatus(user, type);
  }

  // /**대결신청 data[gameMode, 상대방nick], 신청하자마자 status = game 으로 할지 정해야 함.*/
  // @SubscribeMessage('throwGauntlet')
  // async throwGauntlet(
  //   @ConnectedSocket() client,
  //   @MessageBody()
  //   opponentID: string,
  // ) {
  //   const user_id = await this.getUserId(client);
  //   const user = await this.userService.getUserById(user_id);

  //   const opponen = await this.userService.getUserById(opponentID);
  //   if (this.checkAvailableGame(opponen)) {
  //     const roomNumTmp = normalRoom;
  //     normalRoom += 2;

  //     /**상대방 닉네임도 세팅. 대결 거절시 삭제해야됨.*/
  //     getRoomNumWithID.set(opponen.id, roomNumTmp);

  //     this.normalRoomSettings(roomNumTmp, user, 1);
  //     /**자기자신 */
  //     client.emit('vsbattle');
  //     /**상대방 */
  //     this.loginUserGateway.recvBattle(opponen, user.nickname, user.id);
  //   } else {
  //     client.emit('canNotAvailableGame');
  //   }
  // }
  @SubscribeMessage('processGameFrame')
  async processGameFrame(
    client: Socket,
    content: {
      userLocation: number;
      paddlePos: number;
      roomNum: number;
    },
  ) {
    let paddleDelta;
    if (roomManager.has(content.roomNum)) {
      const gameData = roomManager.get(content.roomNum);
      if (content.userLocation == 1) {
        paddleDelta = gameData.leftPaddle - content.paddlePos;
        gameData.leftPaddle = content.paddlePos;
      } else {
        paddleDelta = gameData.rightPaddle - content.paddlePos;
        gameData.rightPaddle = content.paddlePos;
      }
      if (paddleDelta < 0) {
        paddleDelta *= -1;
      }

      gameData.advance(paddleDelta);

      if (
        (gameData.score[0] === finishScore || gameData[1] === finishScore) &&
        gameData.onGame
      ) {
        this.server
          .to(String(content.roomNum))
          .emit('finished', gameData.score);
        gameData.onGame = false;
        await this.pushHistory(content.roomNum, gameData.mode);
        await this.gameResultProcess(gameData, content.roomNum);
        gameData.score = [0, 0];
        // 일반게임이면 레디상태 초기화
        if (content.roomNum % 2 === 0) {
          checkReady.get(content.roomNum)[0] = false;
          checkReady.get(content.roomNum)[1] = false;
        }
      } else if (gameData.onGame === false) {
        client.emit('finished', gameData.score);
      } else {
        this.server.to(String(content.roomNum)).emit('gameData', gameData);
      }
    }
  }
}
