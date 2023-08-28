import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { DirectMessageService } from './directmessage.service';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { UsersService } from 'src/users/users.service';
import { DirectMessage } from './entities/directmessage.entity';

@Controller('dm')
export class DirectMessageController {
  constructor(
    private dmService: DirectMessageService,
    private userService: UsersService,
  ) {}

  //나와 관련된 모든 DM을 가져옴
  @Get('dm')
  @UseGuards(JwtTwoFactorGuard)
  async getAllDM(@Request() req): Promise<DirectMessage[]> {
    const user = await this.userService.getUserById(req.user.id);
    return await this.dmService.getAllDM(user);
  }
}
