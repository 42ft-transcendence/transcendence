import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { DirectMessage } from '../entities/directmessage.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@CustomRepository(DirectMessage)
export class DirectMessageRepository extends Repository<DirectMessage> {
  async getAllDM(user: User): Promise<DirectMessage[]> {
    const messages = await this.find({
      relations: ['from', 'to'],
      where: [{ from: { id: user.id } }, { to: { id: user.id } }],
    });
    return messages;
  }

  async saveDM(from: User, to: User, message: string): Promise<DirectMessage> {
    const dm = new DirectMessage();
    dm.message = message;
    dm.from = from;
    dm.to = to;
    dm.read = false;
    return await this.save(dm);
  }

  async getDM(user1: User, user2: User): Promise<DirectMessage[]> {
    const messages = await this.find({
      relations: ['from', 'to'],
      where: [
        { from: { id: user1.id }, to: { id: user2.id } },
        { from: { id: user2.id }, to: { id: user1.id } },
      ],
    });
    return messages;
  }
}
