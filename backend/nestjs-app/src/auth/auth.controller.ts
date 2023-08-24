import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
  Response,
  Get,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationService } from './2FA/twoFactorAuthentication.service';
import { JwtAuthGuard } from './jwt/jwt-auth.gaurd';
import JwtTwoFactorGuard from './jwt/jwt-two-factor.gaurd';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('/two')
  @UseGuards(JwtAuthGuard)
  async getTwoFactorJwt(
    @Request() req,
    @Response() res,
    @Body('code') code: string,
  ) {
    const user = await this.usersService.getUserById(req.user.user.id);
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    } else {
      const payload = {
        id: user.id,
        isSecondFactorAuthenticated: true,
        sub: user.id,
      };
      const jwt = await this.jwtService.sign(payload);
      res.setHeader('Authorization', 'Bearer ' + jwt);
      res.cookie('jwt', jwt, {
        maxAge: 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      });
      return res.send({
        message: 'success',
      });
    }
  }
  @Get('generate')
  @UseGuards(JwtTwoFactorGuard)
  async register(@Request() req) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        req.user,
      );
    return otpauthUrl;
  }

  @Post('turn-on')
  @UseGuards(JwtTwoFactorGuard)
  async turnOnTwoFactorAuthentication(
    @Request() req,
    @Response() res,
    @Body('code') code,
  ) {
    const user = await this.usersService.getUserById(req.user.id);
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
    const payload = {
      id: user.id,
      isSecondFactorAuthenticated: true,
      sub: user.id,
    };
    const jwt = await this.jwtService.sign(payload);
    res.setHeader('Authorization', 'Bearer ' + jwt);
    res.cookie('jwt', jwt, {
      maxAge: 60 * 60 * 1000,
    });
    return res.send({
      message: 'success',
    });
  }

  @Post('turn-off')
  @UseGuards(JwtTwoFactorGuard)
  async turnOffTwoFactorAuthentication(@Request() req) {
    await this.usersService.turnOffTwoFactorAuthentication(req.user.id);
  }
}
