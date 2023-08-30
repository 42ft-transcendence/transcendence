import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { UserRepository } from 'src/users/repository/user.repository';
import { GameGateway } from './game.gateway';
import { MatchHistorysService } from 'src/match_history/history.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { MatchHistoryModule } from 'src/match_history/history.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [GameController],
  providers: [
    GameGateway,
    MatchHistorysService,
    AuthService,
    UsersService,
    GameService,
  ],

  exports: [GameGateway],
})
export class GameModule {}
