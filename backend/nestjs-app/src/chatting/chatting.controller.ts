import { Controller, Get, Query } from '@nestjs/common';
import { MessageRepository } from 'src/message/repository/message.repository';
import { Message } from 'src/message/entities/message.entity';
import { ChatChannel } from './entities/chatchannel.entity';
@Controller('chatting')
export class ChattingController {
  constructor(private messageRepository: MessageRepository) {}

  @Get('/messages')
  async getMessages(@Query('channelId') channelId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { channelId: channelId },
    });
  }

  @Get('/channels/all')
  async getAllChannels(): Promise<ChatChannel[]> {
    return await ChatChannel.find({
      relations: {
        participants: true,
      },
    });
  }

  @Get('/channels/search')
  async searchChannels(
    @Query('keyword') keyword: string,
  ): Promise<ChatChannel[]> {
    const channels = await ChatChannel.find();
    return await channels.filter((channel) => channel.name.includes(keyword));
  }
}
