import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { GameRoom, GameRoomType, GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { User } from 'src/users/entities/user.entity';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameGateway: GameGateway,
  ) {}

  @Post('/dummyHistory')
  createDummyHistory(): void {
    this.gameGateway.createDummyHistory();
  }
}
