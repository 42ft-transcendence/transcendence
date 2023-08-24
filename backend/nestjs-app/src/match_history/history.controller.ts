import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MatchHistorysService } from './match_historys.service';
import { HistoryDto } from './history.dto';
import { MatchHistory } from './entities/match_historys.entity';

@Controller('MatchHistory')
export class MatchHistorysController {
  constructor(
    private matchHistoryService: MatchHistorysService,
    private userService: UsersService,
  ) {}

  @Post('/')
  async putHistory(@Body() historyDto: HistoryDto) {
    try {
      const player1 = await this.userService.getUserById(historyDto.player1);
      const player2 = await this.userService.getUserById(historyDto.player2);
      await this.matchHistoryService.putHistory(historyDto, player1, player2);
    } catch (e) {
      throw e;
    }
  }

  @Get('/:nickname')
  async getHistoryByNickname(
    @Param('nickname') nickname,
  ): Promise<MatchHistory[]> {
    console.log(nickname);
    return await this.matchHistoryService.getHistoryJoinUserByNickname(
      nickname,
    );
  }
}
