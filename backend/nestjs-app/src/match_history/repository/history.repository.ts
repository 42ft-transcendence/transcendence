import { NotFoundException, HttpException } from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MatchHistory } from '../entities/match_history.entity';
import { HistoryDto } from 'src/match_history/history.dto';

@CustomRepository(MatchHistory)
export class MatchHistoryRepository extends Repository<MatchHistory> {
  async putHistory(history: MatchHistory) {
    await this.save(history);
  }

  async getHistoryJoinUserByNickname(
    nickname: string,
  ): Promise<MatchHistory[]> {
    const user = await this.find({
      relations: ['player1', 'player2'],
      where: [
        { player1: { nickname: nickname } },
        { player2: { nickname: nickname } },
      ],
    });
    return user;
  }

  async getHistoryJoinUserById(id: string): Promise<MatchHistory[]> {
    const histories = await this.find({
      relations: ['player1', 'player2'],
      where: [{ player1: { id } }, { player2: { id } }],
    });
    return histories;
  }
}
