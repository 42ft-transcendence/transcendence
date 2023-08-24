import { Controller, Get, Query } from '@nestjs/common';
import { MessageRepository } from 'src/message/repository/message.repository';
import { Message } from 'src/message/entities/message.entity';
import { Room } from './entities/room.entity';
@Controller('chatting')
export class ChattingController {
  constructor(private messageRepository: MessageRepository) {}

  @Get('/messages')
  async getMessages(@Query('roomId') roomId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { roomId },
    });
  }

  @Get('/rooms/all')
  async getAllRooms(): Promise<Room[]> {
    return await Room.find({
      relations: {
        participants: true,
      },
    });
  }

  @Get('/rooms/search')
  async searchRooms(@Query('keyword') keyword: string): Promise<Room[]> {
    const rooms = await Room.find();
    return await rooms.filter((room) => room.name.includes(keyword));
  }
}
