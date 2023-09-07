import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { UserRepository } from 'src/users/repository/user.repository';
import { GameGateway } from './game.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { MatchHistoryModule } from 'src/match_history/history.module';
import { GameData } from './game.engine';
@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    AuthModule,
    MatchHistoryModule,
  ],
  controllers: [GameController],
  providers: [GameService, UsersService, GameGateway, GameService, GameData],
  exports: [GameService, GameGateway],
})
export class GameModule {}
