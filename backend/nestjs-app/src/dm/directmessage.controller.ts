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

  @Get('dm')
  @UseGuards(JwtTwoFactorGuard)
  async getDM(
    @Request() req,
    @Query('id') user_id: string,
  ): Promise<DirectMessage[]> {
    const user = await this.userService.getUserById(req.user.id);
    const user2 = await this.userService.getUserById(user_id);
    return await this.dmService.getDM(user, user2);
  }
}
