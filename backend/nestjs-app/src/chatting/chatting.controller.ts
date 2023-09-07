import { Controller, Get, Query } from '@nestjs/common';
import { MessageRepository } from 'src/message/repository/message.repository';
import { Message } from 'src/message/entities/message.entity';
import { ChatChannel } from './entities/chatchannel.entity';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { SearchChannelsQueryDto } from './dto/search-channels-query.dto';

@Controller('chatting')
export class ChattingController {
  constructor(private messageRepository: MessageRepository) {}

  @Get('/messages')
  async getMessages(@Query() query: GetMessagesQueryDto): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { channelId: query.channelId },
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
    @Query() query: SearchChannelsQueryDto,
  ): Promise<ChatChannel[]> {
    const channels = await ChatChannel.find();
    return channels.filter((channel) => channel.name.includes(query.keyword));
  }
}
