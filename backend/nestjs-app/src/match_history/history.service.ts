import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryRepository } from './repository/history.repository';
import { MatchHistory } from './entities/match_history.entity';
import { HistoryDto } from './history.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MatchHistorysService {
  constructor(
    @InjectRepository(MatchHistoryRepository)
    private matchHistoryRepository: MatchHistoryRepository,
  ) {}

  async putHistory(historyDto: HistoryDto, player1: User, player2: User) {
    const history = new MatchHistory();
    if (!player1 || !player2) throw new BadRequestException('not exist user');
    history.player1 = player1;
    history.player1Score = historyDto.player1score;
    history.player2 = player2;
    history.player2Score = historyDto.player2score;
    history.gameMode = historyDto.gameMode;
    this.matchHistoryRepository.putHistory(history);
  }

  async getHistoryJoinUserByNickname(nickname: string) {
    const user =
      await this.matchHistoryRepository.getHistoryJoinUserByNickname(nickname);
    return user;
  }
}