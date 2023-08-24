import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repository/user.repository';
import { UsersService } from 'src/users/users.service';
import { ChattingGateway } from './chatting.gateway';
import { MessageService } from 'src/message/message.service';
import { MessageRepository } from 'src/message/repository/message.repository';
import { Message } from 'src/message/entities/message.entity';
import { ChattingController } from './chatting.controller';
import { ChatChannelRepository } from './repository/chatchannel.repository';
import { ParticipantsRepository } from 'src/participants/repository/participants.repository';
import { ParticipantsService } from 'src/participants/participants.service';
import { DMService } from 'src/dm/dm.service';
import { DMRepository } from 'src/dm/repository/dm.repository';
import { ChattingService } from './chatting.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message]),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      MessageRepository,
      ChatChannelRepository,
      ParticipantsRepository,
      DMRepository,
    ]),
    AuthModule,
    HttpModule,
  ],
  providers: [
    AuthService,
    UsersService,
    ChattingGateway,
    MessageService,
    ParticipantsService,
    DMService,
    ChattingService,
  ],
  exports: [ChattingGateway],
  controllers: [ChattingController],
})
export class ChattingModule {}
