import { Injectable } from '@nestjs/common';
import { ChatChannelRepository } from './repository/chatchannel.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from 'socket.io';
import { ParticipantsService } from 'src/participants/participants.service';
import { User } from 'src/users/entities/user.entity';
import { ChatChannel } from './entities/chatchannel.entity';

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

  async editChannel(
    channelId: string,
    userId: string,
    name: string,
    type: string,
    password: string,
  ): Promise<ChatChannel> {
    const channel = await this.channelRepository.findOne({
      relations: ['owner'],
      where: { id: channelId },
    });
    if (!channel) {
      throw new Error('존재하지 않는 채널입니다.');
    } else if (channel.owner.id !== userId) {
      throw new Error('권한이 없습니다.');
    } else {
      return await this.channelRepository.editChatChannel(
        channelId,
        name,
        type,
        password,
      );
    }
  }
}
