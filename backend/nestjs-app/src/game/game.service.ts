import { Injectable } from '@nestjs/common';
import { ChattingGateway } from 'src/chatting/chatting.gateway';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  constructor(
    private usersService: UsersService,
    private rootGateway: ChattingGateway,
  ) {}

  async offerGame(user_id: string, nickname: string): Promise<boolean> {
    const user = await this.usersService.getUserById(user_id);
    if (!user) {
      throw new Error('User not found');
    } else {
      const content = {
        user_id: user_id,
        nickname: nickname,
      };
      this.rootGateway.offerGame('offerGame', content);
      return true;
    }
  }
}
