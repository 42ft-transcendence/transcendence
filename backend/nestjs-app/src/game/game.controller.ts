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

  @Post('battle/offer')
  @UseGuards(JwtTwoFactorGuard)
  async offerBattle(
    @Request() req,
    @Body('awayUser') awayUser: User,
    @Body('myData') myData: User,
    @Body('gameRoomURL') gameRoomURL: string,
    @Body('roomType') roomType: GameRoomType,
  ): Promise<boolean> {
    return this.gameGateway.offerBattle(
      awayUser,
      myData,
      gameRoomURL,
      roomType,
    );
  }

  @Post('battle/accept')
  @UseGuards(JwtTwoFactorGuard)
  async acceptBattle(
    @Request() req,
    @Body('myData') myData: User,
    @Body('awayUser') awayUser: User,
    @Body('gameRoomURL') gameRoomURL: string,
  ): Promise<boolean> {
    return this.gameGateway.acceptBattle(myData, awayUser, gameRoomURL);
  }

  @Post('battle/reject')
  @UseGuards(JwtTwoFactorGuard)
  async rejectBattle(
    @Request() req,
    @Body('awayUser') awayUser: User,
    @Body('gameRoomURL') gameRoomURL: string,
  ): Promise<boolean> {
    return this.gameGateway.rejectBattle(awayUser, gameRoomURL);
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
