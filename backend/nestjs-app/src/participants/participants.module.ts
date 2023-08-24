import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { Participants } from './entities/participants.entity';
import { ParticipantsService } from 'src/participants/participants.service';
import { ParticipantsRepository } from './repository/participants.repository';
import { ParticipantsController } from './participants.controller';
import { ChatChannelRepository } from 'src/chatting/repository/chatchannel.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participants]),
    TypeOrmExModule.forCustomRepository([
      ParticipantsRepository,
      ChatChannelRepository,
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
