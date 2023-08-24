import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { DMService } from './dm.service';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { UsersService } from 'src/users/users.service';
import { DM } from './entities/dm.entity';

@Controller('dm')
export class DMController {
  constructor(
    private dmService: DMService,
    private userService: UsersService,
  ) {}

  @Get('dm')
  @UseGuards(JwtTwoFactorGuard)
  async getDM(@Request() req, @Query('id') user_id: string): Promise<DM[]> {
    const user = await this.userService.getUserById(req.user.id);
    const user2 = await this.userService.getUserById(user_id);
    return await this.dmService.getDM(user, user2);
  }
}
