import { Injectable } from '@nestjs/common';
import { ChatChannelRepository } from './repository/chatchannel.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { ParticipantsService } from 'src/participants/participants.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChattingService {
  constructor(
    @InjectRepository(ChatChannelRepository)
    private readonly channelRepository: ChatChannelRepository,
    private readonly participantsService: ParticipantsService,
  ) {}

  async ownerJoinChannel(
    channelId: string,
    password: string,
    client: Socket,
    user: User,
  ): Promise<void> {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId, password },
    });
    if (!channel) {
      throw new Error('Channel not found');
    }
    client.join(channelId);
    const participant = await this.participantsService.addParticipant(
      true,
      user,
      channel,
      true,
    );
    await this.channelRepository.joinChatChannel(channel, participant);
  }

  async broadcastUpdatedChannelInfo(
    server: Server,
    channelId: string,
  ): Promise<void> {
    const channel = await this.channelRepository.getChannelById(channelId);
    if (channel.type !== 'private') {
      const allChannels = await this.channelRepository.getAllOpenedChannels();
      server.emit('refresh_all_channels', allChannels);
    }
    const participants =
      await this.participantsService.getAllParticipants(channel);
    server.to(channelId).emit('refresh_channel', { channel, participants });
  }
}
