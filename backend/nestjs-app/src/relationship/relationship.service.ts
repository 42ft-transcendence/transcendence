import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserRelationType } from 'src/util';
import { Relationship } from './entities/relationship.entity';
import { RelationshipRepository } from './repository/relationship.repository';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(RelationshipRepository)
    private relationshipRepository: RelationshipRepository,
  ) {}

  async setFriend(from: User, to: User): Promise<Relationship> {
    return await this.relationshipRepository.setRelaiton(
      from,
      to,
      UserRelationType.FRIEND,
    );
  }

  async setBlock(from: User, to: User): Promise<Relationship> {
    return await this.relationshipRepository.setRelaiton(
      from,
      to,
      UserRelationType.BLOCK,
    );
  }

  async checkBlock(from: User, to: User): Promise<boolean> {
    const relation = await this.relationshipRepository.getRelation(from, to);
    if (relation && relation.type === UserRelationType.BLOCK) return true;
    return false;
  }

  async deleteRelation(from: User, to: User): Promise<void> {
    await this.relationshipRepository.deleteRelation(from, to);
  }

  async getFrinedsByUser(user: User): Promise<User[]> {
    return await this.relationshipRepository.getFrinedsByUser(user);
  }

  async getBlocksByUser(user: User): Promise<User[]> {
    return await this.relationshipRepository.getBlocksByUser(user);
  }
}
