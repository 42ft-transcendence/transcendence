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
import { ChatChannelRepository } from './repository/chatchannel.repository';
import { ParticipantsService } from 'src/participants/participants.service';
import { ChatChannel } from './entities/chatchannel.entity';
import { DirectMessageService } from 'src/dm/directmessage.service';
import { DirectMessage } from 'src/dm/entities/directmessage.entity';
import { ChattingService } from './chatting.service';

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
    private channelRepository: ChatChannelRepository,
    private participantsService: ParticipantsService,
    private dmService: DirectMessageService,
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
      const channels = await this.participantsService.getJoinedChannel(user);
      channels.forEach((channel) => {
        client.join(channel.id);
      });
      client.join(user.id);
      this.refreshUsersList();
    } catch (e) {
      console.log(e);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      const userid = await this.getUserId(client);
      const user = await this.userService.getUserById(userid);
      console.log('client disconnected: ', client.id);
      if (user.status === UserStatusType.SIGNUP) {
        await this.userService.deleteUserById(user.id);
      } else {
        await this.userService.updateStatus(user, UserStatusType.OFFLINE);
      }
      this.refreshUsersList();
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    client: Socket,
    content: { message: string; channelId: string },
  ): Promise<any> {
    try {
      const userId = await this.getUserId(client);
      const user = await this.userService.getUserById(userId);
      const channel = await this.channelRepository.getChannelById(
        content.channelId,
      );
      const participant = await this.participantsService.getParticipant(
        user,
        channel,
      );
      if (!participant) {
        throw new Error('채널에 참가하지 않았습니다.');
      } else if (participant.muted) {
        throw new Error('채팅 금지된 사용자입니다.');
      } else {
        const message = await this.messageService.saveMessage(
          userId,
          content.message,
          content.channelId,
        );
        client.to(content.channelId).emit('get_message', {
          user,
          message,
        });
        return { user, message };
      }
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('create_channel')
  async createChannel(
    client: Socket,
    content: { channelName: string; type: string; password: string },
  ): Promise<ChatChannel> {
    try {
      const ownerId = await this.getUserId(client);
      const owner = await this.userService.getUserById(ownerId);
      const channel = await this.channelRepository.createChatChannel(
        content.channelName,
        owner,
        content.type,
        content.password,
      );
      if (!channel) throw new Error('Channel create failed');
      await this.chattingService.ownerJoinChannel(
        channel.id,
        content.password,
        client,
        owner,
      );
      await this.broadcastUpdatedChannelInfo(channel.id);
      return channel;
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('join_channel')
  async joinChannel(
    client: Socket,
    content: { channelId: string; password: string },
  ): Promise<ChatChannel> {
    try {
      const userId = await this.getUserId(client);
      const user = await this.userService.getUserById(userId);
      const channel = await this.channelRepository.getChannelById(
        content.channelId,
      );
      if (
        channel.type !== 'PROTECTED' ||
        channel.password === content.password
      ) {
        client.join(content.channelId);
        const participant = await this.participantsService.addParticipant(
          false,
          user,
          channel,
          false,
        );
        const updatedChannel = await this.channelRepository.joinChatChannel(
          channel,
          participant,
        );
        await this.broadcastUpdatedChannelInfo(channel.id);
        return updatedChannel;
      } else {
        throw new Error('비밀번호가 틀렸습니다.');
      }
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('leave_channel')
  async leaveChannel(
    client: Socket,
    content: { channelId: string },
  ): Promise<void> {
    try {
      const userId = await this.getUserId(client);
      const user = await this.userService.getUserById(userId);
      const channel = await this.channelRepository.getChannelById(
        content.channelId,
      );
      if (channel.owner.id !== userId) {
        client.leave(content.channelId);
        await this.participantsService.deleteParticipant(user, channel);
      } else {
        await this.participantsService.deleteAllParticipant(channel);
        await this.channelRepository.deleteChatChannel(channel);
        this.server
          .to(content.channelId)
          .emit('channel_deleted', content.channelId);
        this.server.socketsLeave(content.channelId);
      }
      await this.broadcastUpdatedChannelInfo(channel.id);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('delete_channel')
  async deleteChannel(
    client: Socket,
    content: { channelId: string },
  ): Promise<void> {
    try {
      const userId = await this.getUserId(client);
      const channel = await this.channelRepository.getChannelById(
        content.channelId,
      );
      if (channel.owner.id !== userId) {
        throw new Error('채널 삭제 권한이 없습니다.');
      }
      await this.participantsService.deleteAllParticipant(channel);
      await this.channelRepository.deleteChatChannel(channel);
      this.server
        .to(content.channelId)
        .emit('channel_deleted', content.channelId);
      this.server.socketsLeave(content.channelId);
      await this.broadcastUpdatedChannelInfo(channel.id);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('kick_user')
  async kickUser(
    client: Socket,
    content: { channelId: string; userId: string },
  ): Promise<void> {
    try {
      const adminId = await this.getUserId(client);
      await this.participantsService.kickUser(
        content.channelId,
        adminId,
        content.userId,
      );
      const admin = await this.userService.getUserById(adminId);
      const target = await this.userService.getUserById(content.userId);
      const message = await this.messageService.saveMessage(
        adminId,
        `관리자 ${admin.nickname}님에 의해 ${target.nickname}님이 강퇴되었습니다.`,
        content.channelId,
      );
      this.server.to(content.channelId).emit('get_message', {
        user: admin,
        message: message,
      });
      const socket = this.findSocketByUserId(content.userId);
      if (socket) {
        socket.leave(content.channelId);
      }
      this.server.to(content.userId).emit('kicked', content.channelId);
      await this.broadcastUpdatedChannelInfo(content.channelId);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('mute_user')
  async muteUser(
    client: Socket,
    content: { channelId: string; userId: string },
  ): Promise<void> {
    try {
      const adminId = await this.getUserId(client);
      await this.participantsService.changeMute(
        content.channelId,
        adminId,
        content.userId,
        true,
      );
      const admin = await this.userService.getUserById(adminId);
      const target = await this.userService.getUserById(content.userId);
      const message = await this.messageService.saveMessage(
        adminId,
        `관리자 ${admin.nickname}님에 의해 ${target.nickname}님이 채팅 금지가 되었습니다.`,
        content.channelId,
      );
      this.server.to(content.channelId).emit('get_message', {
        user: admin,
        message: message,
      });
      await this.broadcastUpdatedChannelInfo(content.channelId);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('unmute_user')
  async unmuteUser(
    client: Socket,
    content: { channelId: string; userId: string },
  ) {
    try {
      const adminId = await this.getUserId(client);
      await this.participantsService.changeMute(
        content.channelId,
        adminId,
        content.userId,
        false,
      );
      const admin = await this.userService.getUserById(adminId);
      const target = await this.userService.getUserById(content.userId);
      const message = await this.messageService.saveMessage(
        adminId,
        `관리자 ${admin.nickname}님에 의해 ${target.nickname}님이 채팅 금지가 해제 되었습니다.`,
        content.channelId,
      );
      this.server.to(content.channelId).emit('get_message', {
        user: admin,
        message: message,
      });
      await this.broadcastUpdatedChannelInfo(content.channelId);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('appoint_admin')
  async appointAdmin(
    client: Socket,
    content: { channelId: string; userId: string; to: boolean },
  ) {
    try {
      const ownerId = await this.getUserId(client);
      await this.participantsService.changeAdmin(
        content.channelId,
        ownerId,
        content.userId,
        content.to,
      );
      const owner = await this.userService.getUserById(ownerId);
      const target = await this.userService.getUserById(content.userId);
      const message = await this.messageService.saveMessage(
        ownerId,
        `채널 소유자 ${owner.nickname}님에 의해 ${target.nickname}님이 관리자${
          content.to ? '로 임명' : '에서 해임'
        } 되었습니다.`,
        content.channelId,
      );
      this.server.to(content.channelId).emit('get_message', {
        user: owner,
        message: message,
      });
      await this.broadcastUpdatedChannelInfo(content.channelId);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('enter_channel')
  async enterChannel(client: Socket, content: { channelId: string }) {
    try {
      const userId = await this.getUserId(client);
      const user = await this.userService.getUserById(userId);
      const channel = await this.channelRepository.getChannelById(
        content.channelId,
      );
      const participant = await this.participantsService.getParticipant(
        user,
        channel,
      );
      if (!participant) {
        throw new Error('채널에 참가하지 않았습니다.');
      }
      const participants =
        await this.participantsService.getAllParticipants(channel);
      const messages = await this.messageService.getMessages(content.channelId);
      await this.broadcastUpdatedChannelInfo(channel.id);
      return { channel, messages, participants };
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  @SubscribeMessage('edit_channel')
  async editChannel(
    client: Socket,
    content: {
      channelId: string;
      channelName: string;
      type: string;
      password: string;
    },
  ) {
    try {
      const userId = await this.getUserId(client);
      const channel = await this.chattingService.editChannel(
        content.channelId,
        userId,
        content.channelName,
        content.type,
        content.password,
      );
      await this.broadcastUpdatedChannelInfo(content.channelId);
      return { channel };
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  @SubscribeMessage('send_dm')
  async sendDM(
    client: Socket,
    content: { userId: string; message: string },
  ): Promise<DirectMessage> {
    try {
      const userId = await this.getUserId(client);
      const user = await this.userService.getUserById(userId);
      const toUser = await this.userService.getUserById(content.userId);
      const dm = await this.dmService.saveDM(user, toUser, content.message);
      client.to(content.userId).emit('get_dm', {
        user: user,
        message: dm,
      });
      return dm;
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('enter_dm')
  async enterDM(client: Socket, content: { userId: string }) {
    try {
      const userId = await this.getUserId(client);
      const user = await this.userService.getUserById(userId);
      const toUser = await this.userService.getUserById(content.userId);
      const dm = await this.dmService.getDM(user, toUser);
      return { toUser, dm };
    } catch (e) {
      console.log(e);
    }
  }

  async refreshUsersList(): Promise<void> {
    const users = await this.userService.getAllUserList();
    this.server.emit('refresh_users', users);
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

  private findSocketByUserId(userId: string): Socket | undefined {
    const sockets = this.server.sockets.sockets;
    for (const socketId in sockets) {
      if (sockets[socketId].handshake.query.userId === userId) {
        return sockets[socketId];
      }
    }
    return undefined;
  }

  private async broadcastUpdatedChannelInfo(channelId: string): Promise<void> {
    let channel: undefined | ChatChannel = undefined;
    try {
      channel = await this.channelRepository.getChannelById(channelId);
    } catch (e) {
      console.log(e);
    }
    if (channel) {
      const participants =
        await this.participantsService.getAllParticipants(channel);
      this.server
        .to(channelId)
        .emit('refresh_channel', { channel, participants });
    }
    if (channel && channel.type === 'PRIVATE') {
      const allChannels = await this.channelRepository.getAllOpenedChannels();
      this.server.emit('refresh_all_channels', allChannels);
    }
  }
}
