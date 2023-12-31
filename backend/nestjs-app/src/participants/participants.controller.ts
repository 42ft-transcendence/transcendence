import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { Participants } from './entities/participants.entity';
import { ParticipantsService } from 'src/participants/participants.service';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { ChatChannel } from 'src/chatting/entities/chatchannel.entity';
import { ChatChannelRepository } from 'src/chatting/repository/chatchannel.repository';
import { ChannelIdDto } from './dto/channel-id.dto';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private participantsService: ParticipantsService,
    private channelRepository: ChatChannelRepository,
  ) {}

  @Get('/channels')
  @UseGuards(JwtTwoFactorGuard)
  async getChannels(@Request() req): Promise<ChatChannel[]> {
    return await this.participantsService.getJoinedChannel(req.user);
  }

  @Get('/participants')
  async getParticipantsByChannelId(
    @Query() channelIdDto: ChannelIdDto,
  ): Promise<Participants[]> {
    const channel = await this.channelRepository.getChannelById(
      channelIdDto.channelId,
    );
    return await this.participantsService.getAllParticipants(channel);
  }
}
