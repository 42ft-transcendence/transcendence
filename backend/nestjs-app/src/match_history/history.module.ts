import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from './entities/match_historys.entity';
import { MatchHistorysController } from './match_historys.controller';
import { MatchHistorysService } from './match_historys.service';
import { MatchHistoryRepository } from './match_history.repository';
import { UserRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';
import { TypeOrmExModule } from 'nestjs-typeorm-paginate';
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
