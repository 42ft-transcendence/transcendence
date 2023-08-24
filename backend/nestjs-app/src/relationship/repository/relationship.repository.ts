import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Relationship } from '../entities/relationship.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRelationType } from 'src/util';

@CustomRepository(Relationship)
export class RelationshipRepository extends Repository<Relationship> {
  async getFrinedsByUser(user: User): Promise<User[]> {
    const friends: User[] = [];
    const data = await this.find({
      relations: ['to'],
      where: {
        from: { id: user.id },
      },
    });
    data.forEach((value) => {
      if (value.type == UserRelationType.FRIEND) friends.push(value.to);
    });
    return friends;
  }

  async getBlocksByUser(user: User) {
    const friends: User[] = [];
    const data = await this.find({
      relations: ['to'],
      where: {
        from: { id: user.id },
      },
    });
    data.forEach((value) => {
      if (value.type == UserRelationType.BLOCK) friends.push(value.to);
    });
    return friends;
  }

  async getRelation(from: User, to: User) {
    const relaiton = await this.findOne({
      where: {
        from: { id: from.id },
        to: { id: to.id },
      },
    });
    if (relaiton) return relaiton;
  }

  async setRelaiton(
    from: User,
    to: User,
    type: UserRelationType,
  ): Promise<Relationship> {
    let relation;
    const exist = await this.getRelation(from, to);
    if (exist) {
      relation = exist;
      relation.type = type;
    } else {
      relation = new Relationship();
      relation.type = type;
      relation.from = from;
      relation.to = to;
    }
    this.save(relation);
    return relation;
  }

  async deleteRelation(from: User, to: User) {
    const exist = await this.getRelation(from, to);
    if (exist) {
      this.delete(exist.id);
    }
  }
}
