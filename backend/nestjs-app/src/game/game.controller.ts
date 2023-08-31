import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { User } from 'src/users/entities/user.entity';

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
    @Body('id') user_id: string,
    @Body('awayUser') awayUser: User,
    @Body('gameRoomURL') gameRoomURL: string,
  ): Promise<boolean> {
    return await this.gameGateway.offerGame(user_id, awayUser, gameRoomURL);
  }

  @Post('battle/accept')
  @UseGuards(JwtTwoFactorGuard)
  async acceptBattle(
    @Request() req,
    @Body('myData') myData: User,
    @Body('awayUser') awayUser: User,
    @Body('gameRoomURL') gameRoomURL: string,
  ): Promise<boolean> {
    return await this.gameGateway.acceptBattle(myData, awayUser, gameRoomURL);
  }
}
