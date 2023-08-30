import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { TMP, UserStatusType } from 'src/util';
import { UsersService } from 'src/users/users.service';
import { MessageService } from 'src/message/message.service';
import { RoomRepository } from './repository/room.repository';
import { ParticipantsService } from 'src/participants/participants.service';
import { Room } from './entities/room.entity';
import { DMService } from 'src/dm/dm.service';
import { DM } from 'src/dm/entities/dm.entity';
import { ChattingService } from './chatting.service';
import { HttpException } from '@nestjs/common';

@WebSocketGateway({
  // cors: {
  //   origin: 'http://localhost:3000',
  // },
  middlewares: [],
  namespace: '/ChatPage',
  credential: true,
})
export class ChattingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private messageService: MessageService,
    private roomRepository: RoomRepository,
    private participantsService: ParticipantsService,
    private dmService: DMService,
    private chattingService: ChattingService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket): Promise<void> {
    try {
      const userid = await this.getUserId(client);
      const user = await this.userService.getUserById(userid);
      console.log('client connected: ', client.id);
      if (user.status === UserStatusType.OFFLINE) {
        await this.userService.updateStatus(user, UserStatusType.ONLINE);
      }
      // 해당 유저가 참여한 모든 룸 join하기
      this.refreshUsersList();
      client.join('lobby');
    } catch (e) {}
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      const userid = await this.getUserId(client);
      const user = await this.userService.getUserById(userid);
      client.leave('lobby');
      console.log('client disconnected: ', client.id);
      if (user.status === UserStatusType.SIGNUP) {
        await this.userService.deleteUserById(user.id);
      } else {
        await this.userService.updateStatus(user, UserStatusType.OFFLINE);
      }
      this.refreshUsersList();
    } catch (e) {}
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    client: Socket,
    content: { message: string; roomId: string },
  ): Promise<any> {
    const userid = await this.getUserId(client);
    const user = await this.userService.getUserById(userid);
    const message = await this.messageService.saveMessage(
      userid,
      content.message,
      content.roomId,
    );
    client.to(content.roomId).emit('get_message', {
      user,
      message,
    });
    return { user, message };
  }

  @SubscribeMessage('create_room')
  async createRoom(
    client: Socket,
    data: { roomName: string; type: string; password: string },
  ): Promise<Room> {
    const ownerId = await this.getUserId(client);
    const owner = await this.userService.getUserById(ownerId);
    const room = await this.roomRepository.createRoom(
      data.roomName,
      owner,
      data.type,
      data.password,
    );
    await this.chattingService.ownerJoinRoom(
      room.id,
      data.password,
      client,
      owner,
    );
    return room;
  }

  @SubscribeMessage('join_room')
  async joinRoom(
    client: Socket,
    data: { roomId: string; password: string },
  ): Promise<Room> {
    const userId = await this.getUserId(client);
    const user = await this.userService.getUserById(userId);
    const room = await this.roomRepository.getRoomById(data.roomId);
    if (room.type !== 'PROTECTED' || room.password === data.password) {
      client.join(data.roomId);
      const participant = await this.participantsService.addParticipant(
        false,
        user,
        room,
        false,
      );
      return await this.roomRepository.joinRoom(room, participant);
    } else {
      throw new Error('비밀번호가 틀렸습니다.');
    }
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(client: Socket, roomId: string): Promise<void> {
    const userId = await this.getUserId(client);
    const user = await this.userService.getUserById(userId);
    const room = await this.roomRepository.getRoomById(roomId);
    if (room) {
      client.leave(roomId);
      await this.participantsService.deleteParticipant(user, room);
    }
    if (!room.participants) {
      await this.roomRepository.deleteRoom(room);
    }
  }

  @SubscribeMessage('kick_user')
  async kickUser(client: Socket, data: { roomId: string; userId: string }) {
    const adminId = await this.getUserId(client);
    const admin = await this.userService.getUserById(adminId);
    const room = await this.roomRepository.getRoomById(data.roomId);
    const participants =
      await this.participantsService.getAllParticipants(room);
    const participant = participants.find(
      (participant) => participant.user.id === data.userId,
    );
    if (participant) {
      const message = {
        id: adminId,
        content: `관리자 ${admin.nickname}님에 의해 ${participant.user.nickname}님이 강퇴당하셨습니다.`,
        roomId: data.roomId,
      };
      client.to(data.roomId).emit('get_message', {
        user: admin,
        message: message,
      });
      await this.participantsService.deleteParticipant(participant.user, room);
      client.leave(data.roomId);
      await this.roomRepository.leaveRoom(room, participant);
    }
  }

  @SubscribeMessage('mute')
  async muteUser(client: Socket, data: { roomId: string; userId: string }) {
    const adminId = await this.getUserId(client);
    const admin = await this.userService.getUserById(adminId);
    const room = await this.roomRepository.getRoomById(data.roomId);
    const participants =
      await this.participantsService.getAllParticipants(room);
    const participant = participants.find(
      (participant) => participant.user.id === data.userId,
    );

    if (participant) {
      const message = {
        id: adminId,
        content: `관리자 ${admin.nickname}님에 의해 ${participant.user.nickname}님이 채팅 금지당하셨습니다.`,
        roomId: data.roomId,
      };
      client.to(data.roomId).emit('get_message', {
        user: admin,
        message: message,
      });
      await this.participantsService.changeMuted(participant.user, room, true);
    }
  }

  @SubscribeMessage('unmute')
  async unmuteUser(client: Socket, data: { roomId: string; userId: string }) {
    const adminId = await this.getUserId(client);
    const admin = await this.userService.getUserById(adminId);
    const room = await this.roomRepository.getRoomById(data.roomId);
    const participants =
      await this.participantsService.getAllParticipants(room);
    const participant = participants.find(
      (participant) => participant.user.id === data.userId,
    );

    if (participant) {
      const message = {
        id: adminId,
        content: `관리자 ${admin.nickname}님에 의해 ${participant.user.nickname}님이 채팅 금지가 풀렸습니다.`,
        roomId: data.roomId,
      };
      client.to(data.roomId).emit('get_message', {
        user: admin,
        message: message,
      });
      await this.participantsService.changeMuted(participant.user, room, false);
    }
  }

  @SubscribeMessage('send_dm')
  async sendDm(
    client: Socket,
    data: { userId: string; message: string },
  ): Promise<DM[]> {
    const userId = await this.getUserId(client);
    const user = await this.userService.getUserById(userId);
    const toUser = await this.userService.getUserById(data.userId);

    await this.dmService.saveDM(user, toUser, data.message);
    const dm = await this.dmService.getDM(user, toUser);
    client.to(data.userId).emit('get_dm', {
      user: user,
      message: dm,
    });
    return dm;
  }

  async refreshUsersList(): Promise<void> {
    const users = await this.userService.getAllUserList();
    this.server.emit('refresh_list', users);
  }

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
}
