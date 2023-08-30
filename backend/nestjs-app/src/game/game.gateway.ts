import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { TMP, UserStatusType } from 'src/util';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MatchHistorysService } from 'src/match_history/history.service';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

export const rankRoom = 0;
export const normalRoom = 1;
export const finishScore = 5;

export class GameData {
  left_user: number;
  right_user: number;
  ball_x: number;
  ball_y: number;
  ball_vec_x: number;
  ball_vec_y: number;
  ball_speed: number;
  score: [number, number];
  mode: number;
  hitPlayer: number;
  onGame: boolean;

  public reset() {
    this.ball_x = 350;
    this.ball_y = 250;
    this.ball_vec_y = 0;
    this.ball_speed = 8;
  }
}

interface RoomData {
  name: string;
  pass: string;
  mode: number;
  person: number;
  id: number;
  secret: boolean;
  participation: boolean;
}

export const roomManager = new Map<number, GameData>();
export const roomList = new Map<number, RoomData>();
export const getPlayerWithRoomnum = new Map<number, [string, string]>();
export const getRoomNumWithID = new Map<string, number>();
export const getUser = new Map<number, [User, User]>();
export const getUserList = new Map<number, User[]>();
export const checkReady = new Map<number, [boolean, boolean]>();
export const checkStart = new Map<number, [boolean, boolean]>();

@WebSocketGateway({
  // cors: {
  //   origin: "*",
  // },
  middlewares: [],
  namespace: '/game',
})
export class GameGateway {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  async offerGame(user_id: string, nickname: string): Promise<boolean> {
    const user = await this.userService.getUserById(user_id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const content = {
        user_id: user_id,
        nickname: nickname,
      };
      this.server.emit('offerGame', content);
      return true;
    }
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

  // async deleteProcess(
  //   @ConnectedSocket() client,
  //   roomNum: number,
  //   userLeft: string,
  //   userright: string,
  //   connectedNickName: string,
  // ) {
  //   // 소켓 클라인트가 누군지 특정
  //   const user_id = await this.getUserId(client);
  //   // let user = await this.userService.getUserById(user_id);

  //   // 해당 방의 유저 정보 삭제
  //   // 참가 할 수 있는 여부를 true로 바꾼다.
  //   if (roomList.has(roomNum)) {
  //     roomList.get(roomNum).person--;
  //     roomList.get(roomNum).participation = true;
  //   }
  //   //
  //   if (connectedNickName == userLeft) {
  //     getPlayerWithRoomnum.get(roomNum)[0] = '';
  //     if (roomNum % 2) {
  //       checkReady.get(roomNum)[0] = false;
  //       checkReady.get(roomNum)[1] = false;
  //       checkStart.get(roomNum)[0] = false;
  //       checkStart.get(roomNum)[1] = false;

  //       this.server
  //         .to(roomNum.toString())
  //         .emit('usersReadySet', checkReady.get(roomNum));
  //     }
  //   } else if (connectedNickName == userright) {
  //     getPlayerWithRoomnum.get(roomNum)[1] = '';
  //     if (roomNum % 2) {
  //       checkReady.get(roomNum)[0] = false;
  //       checkReady.get(roomNum)[1] = false;
  //       checkStart.get(roomNum)[0] = false;
  //       checkStart.get(roomNum)[1] = false;

  //       this.server
  //         .to(roomNum.toString())
  //         .emit('usersReadySet', checkReady.get(roomNum));
  //     }
  //   }

  //   this.server
  //     .to(roomNum.toString())
  //     .emit('allUserSet', await this.gameService.checkUserSet(roomNum));

  //   client.leave(roomNum.toString());

  //   /**플레이어가 없는 경우 */
  //   if (
  //     getPlayerWithRoomnum.get(roomNum)[0] == '' &&
  //     getPlayerWithRoomnum.get(roomNum)[1] == ''
  //   ) {
  //     /**해당 방의 플레이어 정보 삭제 */
  //     getPlayerWithRoomnum.delete(roomNum);

  //     /**해당 방 게임정보 삭제 */
  //     roomManager.delete(roomNum);

  //     /**해당 방 user정보 삭제 */
  //     getUser.delete(roomNum);

  //     /**roomList 에서 방정보 삭제, 프론트에 갱신*/
  //     roomList.delete(roomNum);

  //     /**방관련 데이터 삭제 */
  //     checkStart.delete(roomNum);
  //     if (roomNum % 2) {
  //       checkReady.delete(roomNum);
  //     }
  //   }
  //   this.server.emit('roomList', JSON.stringify(Array.from(roomList)));
  // }

  /**유저의 Id 값을 get */
  private async getUserId(client: Socket) {
    try {
      let jwt = String(client.handshake.headers.authorization);
      jwt = jwt.replace('Bearer ', '');
      const user: TMP = await this.authService.jwtVerify(jwt);
      console.log(`success getuserid: ${user.id}`);
      return user.id;
    } catch (e) {
      throw new HttpException('Token Expired Error', 409);
    }
  }

  /**유저가 소켓에 연결 됐을 때 */
  async handleConnection(@ConnectedSocket() client) {
    const user_id = await this.getUserId(client);
    const user = await this.userService.getUserById(user_id);
    console.log('connect game : ' + user.nickname);
  }

  // /**유저가 소켓과 연결을 끊었을 때 */
  // async handleDisconnect(@ConnectedSocket() client) {
  //   const user_id = await this.getUserId(client);
  //   const user = await this.userService.getUserById(user_id);
  //   console.log('leave game : ', user.nickname);
  //   const roomNum = getRoomNumWithID.get(user.id);

  //   /**플레이어가 disconnect된 경우 해당 방 관련 정보 모두 삭제되기 때문에 나머지socket들 disconnect시 처리 안하도록 undefinde인지 체크 */
  //   if (roomNum != undefined) {
  //     getRoomNumWithID.delete(user.id);

  //     const connectedNickName = user.nickname;
  //     let userLeft = '';
  //     let userright = '';
  //     await this.userService.updateStatus(user, UserStatusType.ONLINE);
  //     const findIndex = getUserList
  //       .get(roomNum)
  //       .findIndex((item) => item.id === user.id);
  //     if (findIndex !== -1) getUserList.get(roomNum).splice(findIndex, 1);
  //     this.server.to(roomNum.toString()).emit('AllUserList', {
  //       data: getUserList.get(roomNum),
  //     });
  //     if (getPlayerWithRoomnum.has(roomNum)) {
  //       userLeft = getPlayerWithRoomnum.get(roomNum)[0];
  //       userright = getPlayerWithRoomnum.get(roomNum)[1];
  //     }

  //     if (
  //       /**플레이어인지 관전자인지 확인 */
  //       connectedNickName == userLeft ||
  //       connectedNickName == userright
  //     ) {
  //       //**플레이어일 경우 */
  //       await this.disconnectProcess(
  //         client,
  //         roomNum,
  //         userLeft,
  //         userright,
  //         connectedNickName,
  //       );
  //     }
  //   }
  // }

  // // disconnect시 처리
  // // 몰수처리와 삭제 처리를 한다.
  // async disconnectProcess(
  //   @ConnectedSocket() client,
  //   roomNum: number,
  //   userLeft: string,
  //   userright: string,
  //   connectedNickName: string,
  // ) {
  //   /**몰수처리 */
  //   await this.gameService.ConfiscationProcess(
  //     roomNum,
  //     userLeft,
  //     userright,
  //     connectedNickName,
  //     this.server,
  //   );
  // }
}
