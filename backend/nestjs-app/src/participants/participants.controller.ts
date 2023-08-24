import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { Participants } from './entities/participants.entity';
import { ParticipantsService } from 'src/participants/participants.service';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { ChatChannel } from 'src/chatting/entities/chatchannel.entity';
import { ChatChannelRepository } from 'src/chatting/repository/chatchannel.repository';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private participantsService: ParticipantsService,
    private roomRepository: ChatChannelRepository,
  ) {}

  @Get('/rooms')
  @UseGuards(JwtTwoFactorGuard)
  async getRooms(@Request() req): Promise<ChatChannel[]> {
    return await this.participantsService.getroomByUser(req.user);
  }

  @Get('/participants')
  async getUsers(@Query('roomId') roomId: string): Promise<Participants[]> {
    const room = await this.roomRepository.getChannelById(roomId);
    return await this.participantsService.getAllParticipants(room);
  }
}
