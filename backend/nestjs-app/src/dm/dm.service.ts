import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMRepository } from './repository/dm.repository';
import { User } from 'src/users/entities/user.entity';
import { DM } from './entities/dm.entity';

@Injectable()
export class DMService {
  constructor(
    @InjectRepository(DMRepository)
    private dmRepository: DMRepository,
  ) {}

  async saveDM(from: User, to: User, message: string): Promise<DM> {
    return await this.dmRepository.saveDM(from, to, message);
  }

  async getDM(user1: User, user2: User): Promise<DM[]> {
    return await this.dmRepository.getDM(user1, user2);
  }
}
