import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryRepository } from './repository/history.repository';
import { MatchHistory } from './entities/match_history.entity';
import { HistoryDto } from './dto/history.dto';
import { User } from '../users/entities/user.entity';
import { async } from 'rxjs';

@Injectable()
export class MatchHistorysService {
  constructor(
    @InjectRepository(MatchHistoryRepository)
    private matchHistoryRepository: MatchHistoryRepository,
  ) {}
  putHistory(historyDto: HistoryDto, createdAt?: Date) {
    const history = new MatchHistory();
    history.player1 = historyDto.player1;
    history.player1Score = historyDto.player1Score;
    history.player1ScoreChange = historyDto.player1ScoreChange;
    history.player2 = historyDto.player2;
    history.player2Score = historyDto.player2Score;
    history.player2ScoreChange = historyDto.player2ScoreChange;
    history.roomType = historyDto.roomType;
    history.map = historyDto.map;
    history.createdAt = createdAt ? createdAt : new Date();
    history.isDummy = historyDto.isDummy;
    this.matchHistoryRepository.putHistory(history);
  }

  async getHistoryJoinUserById(id: string) {
    const user = await this.matchHistoryRepository.getHistoryJoinUserById(id);
    return user;
  }

  async deleteDummyHistory() {
    const histories = await this.matchHistoryRepository.find({
      where: { isDummy: true },
    });
    await this.matchHistoryRepository.deleteDummyHistory(histories);
  }
}
