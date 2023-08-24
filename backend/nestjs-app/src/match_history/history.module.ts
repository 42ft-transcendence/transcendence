import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from './entities/match_history.entity';
import { MatchHistorysController } from './history.controller';
import { MatchHistorysService } from './history.service';
import { MatchHistoryRepository } from './repository/history.repository';
import { UserRepository } from '../users/repository/user.repository';
import { UsersService } from '../users/users.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchHistory, User]),
    TypeOrmExModule.forCustomRepository([
      MatchHistoryRepository,
      UserRepository,
    ]),
  ],
  controllers: [MatchHistorysController],
  providers: [MatchHistorysService, UsersService],
})
export class MatchHistoryModule {}
