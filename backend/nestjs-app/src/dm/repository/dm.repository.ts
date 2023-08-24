import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { DM } from '../entities/dm.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@CustomRepository(DM)
export class DMRepository extends Repository<DM> {
  async saveDM(from: User, to: User, message: string): Promise<DM> {
    const dm = new DM();
    dm.message = message;
    dm.from = from;
    dm.to = to;
    dm.read = false;
    return await this.save(dm);
  }

  async getDM(user1: User, user2: User): Promise<DM[]> {
    const messages = await this.find({
      where: [
        { from: { id: user1.id }, to: { id: user2.id } },
        { from: { id: user2.id }, to: { id: user1.id } },
      ],
    });
    return messages;
  }
}
