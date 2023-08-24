import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { Participants } from './entities/participants.entity';
import { ParticipantsService } from 'src/participants/participants.service';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { Room } from 'src/chatting/entities/room.entity';
import { RoomRepository } from 'src/chatting/repository/room.repository';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private participantsService: ParticipantsService,
    private roomRepository: RoomRepository,
  ) {}

  @Get('/rooms')
  @UseGuards(JwtTwoFactorGuard)
  async getRooms(@Request() req): Promise<Room[]> {
    return await this.participantsService.getroomByUser(req.user);
  }

  @Get('/participants')
  async getUsers(@Query('roomId') roomId: string): Promise<Participants[]> {
    const room = await this.roomRepository.getRoomById(roomId);
    return await this.participantsService.getAllParticipants(room);
  }
}
