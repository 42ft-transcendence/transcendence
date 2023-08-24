import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { UserRepository } from 'src/users/repository/user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [GameController],
  providers: [GameService, UsersService],
})
export class GameModule {}
