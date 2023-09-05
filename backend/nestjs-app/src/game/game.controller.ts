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

  @Post('battle/create')
  @UseGuards(JwtTwoFactorGuard)
  async createGameRoom(
    @Request() req,
    @Body('gameRoomInfo') gameRoomInfo: GameRoom,
  ): Promise<boolean> {
    console.log('createGameRoom gameRoomInfo: ', gameRoomInfo);
    this.gameService.createGameRoom(gameRoomInfo);
    this.gameGateway.refreshGameRoomList();
    return true;
  }

  @Post('battle/ready')
  @UseGuards(JwtTwoFactorGuard)
  async readySignal(
    @Request() req,
    @Body('gameRoomURL') gameRoomURL: string,
    @Body('myData') myData: User,
  ): Promise<boolean> {
    return this.gameGateway.readySignal(gameRoomURL, myData);
  }

  @Post('battle/readyCancle')
  @UseGuards(JwtTwoFactorGuard)
  async readyCancleSignal(
    @Request() req,
    @Body('gameRoomURL') gameRoomURL: string,
    @Body('myData') myData: User,
  ): Promise<boolean> {
    return this.gameGateway.readyCancleSignal(gameRoomURL, myData);
  }

  @Post('battle/exit')
  @UseGuards(JwtTwoFactorGuard)
  async exitGameRoom(
    @Request() req,
    @Body('gameRoomURL') gameRoomURL: string,
    @Body('myData') myData: User,
  ): Promise<boolean> {
    return this.gameGateway.exitGameRoom(gameRoomURL, myData);
  }
}
