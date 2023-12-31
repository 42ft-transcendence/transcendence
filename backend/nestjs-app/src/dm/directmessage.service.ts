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

  async getAllDM(user: User): Promise<DirectMessage[]> {
    return await this.dmRepository.getAllDM(user);
  }

  async saveDM(from: User, to: User, message: string): Promise<DirectMessage> {
    const message2 = await this.dmRepository.saveDM(from, to, message);
    if (!message2) {
      throw new Error('Message not saved');
    }
    return message2;
  }

  async getDM(user1: User, user2: User): Promise<DirectMessage[]> {
    return await this.dmRepository.getDM(user1, user2);
  }
}
