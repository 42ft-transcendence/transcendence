import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DirectMessageRepository } from './repository/directmessage.repository';
import { User } from 'src/users/entities/user.entity';
import { DirectMessage } from './entities/directmessage.entity';

@Injectable()
export class DirectMessageService {
  constructor(
    @InjectRepository(DirectMessageRepository)
    private dmRepository: DirectMessageRepository,
  ) {}

  async saveDM(from: User, to: User, message: string): Promise<DirectMessage> {
    return await this.dmRepository.saveDM(from, to, message);
  }

  async getDM(user1: User, user2: User): Promise<DirectMessage[]> {
    return await this.dmRepository.getDM(user1, user2);
  }
}
