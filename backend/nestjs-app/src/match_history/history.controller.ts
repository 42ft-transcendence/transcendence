import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MatchHistorysService } from './history.service';
import { HistoryDto } from './dto/history.dto';
import { MatchHistory } from './entities/match_history.entity';
import { NicknameParamDto } from './dto/nickname-param.dto';
import { IdParamDto } from './dto/id-param.dto';

@Controller('MatchHistory')
export class MatchHistorysController {
  constructor(
    private matchHistoryService: MatchHistorysService,
    private userService: UsersService,
  ) {}
  @Get('/:nickname')
  async getHistoryByNickname(
    @Param() params: NicknameParamDto,
  ): Promise<MatchHistory[]> {
    return await this.matchHistoryService.getHistoryJoinUserByNickname(
      params.nickname,
    );
  }

  @Get('/:id')
  async getHistoryById(@Param() params: IdParamDto): Promise<MatchHistory[]> {
    return await this.matchHistoryService.getHistoryJoinUserById(params.id);
  }
}
