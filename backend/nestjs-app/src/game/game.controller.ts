import { Controller, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

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
