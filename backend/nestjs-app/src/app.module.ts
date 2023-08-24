import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmExModule } from './database/typeorm-ex-module';
import { UserRepository } from './users/repository/user.repository';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ChattingModule } from './chatting/chatting.module';
import { FileModule } from './file/file.module';
import { MessageModule } from './message/message.module';
import { MessageRepository } from './message/repository/message.repository';
import { DMModule } from './dm/dm.module';
import { ParticipantsModule } from './participants/participants.module';
import { RelationshipModule } from './relationship/relationship.module';
import { GameModule } from './game/game.module';
import { MatchHistoryModule } from './match_history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    TypeOrmExModule.forCustomRepository([UserRepository, MessageRepository]),
    ChattingModule,
    FileModule,
    MessageModule,
    DMModule,
    ParticipantsModule,
    RelationshipModule,
    GameModule,
    MatchHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
