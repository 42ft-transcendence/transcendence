import { Controller, Get, Query } from '@nestjs/common';
import { MessageRepository } from 'src/message/repository/message.repository';
import { Message } from 'src/message/entities/message.entity';
import { ChatChannel } from './entities/chatchannel.entity';
@Controller('chatting')
export class ChattingController {
  constructor(private messageRepository: MessageRepository) {}

  @Get('/messages')
  async getMessages(@Query('roomId') roomId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { roomId },
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
    const rooms = await ChatChannel.find();
    return await rooms.filter((room) => room.name.includes(keyword));
  }
}
