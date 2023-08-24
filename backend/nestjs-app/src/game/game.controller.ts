import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('battle/offer')
  @UseGuards(JwtTwoFactorGuard)
  async offerGame(
    @Request() req,
    @Body('id') user_id: string,
    @Body('nickname') nickname: string,
  ): Promise<boolean> {
    return await this.gameService.offerGame(user_id, nickname);
  }
}
