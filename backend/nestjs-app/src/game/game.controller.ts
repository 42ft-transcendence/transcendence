import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { User } from 'src/users/entities/user.entity';
import { OfferGameDto } from './dto/offer-game.dto';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameGateway: GameGateway,
  ) {}

  @Post('battle/offer')
  @UseGuards(JwtTwoFactorGuard)
  async offerGame(
    @Request() req,
    @Body() offerGameDto: OfferGameDto,
  ): Promise<boolean> {
    return await this.gameGateway.offerGame(
      offerGameDto.id,
      offerGameDto.awayUser,
    );
  }
}
