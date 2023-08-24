import { NotFoundException, HttpException } from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { UserStatusType } from 'src/util';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async checkUser(id2: string): Promise<boolean> {
    const found = await this.findOne({
      where: {
        id: id2,
      },
    });
    if (found) {
      return true;
    }
    return false;
  }

  async getUserById(id2: string): Promise<User> {
    const found = await this.findOne({
      where: {
        id: id2,
      },
    });
    if (!found) {
      throw new NotFoundException(`this is getuserById repository`);
    }
    return found;
  }

  async getUserByNickname(nickname2: string): Promise<User | undefined> {
    const found = await this.findOne({
      where: {
        nickname: nickname2,
      },
    });
    return found;
  }

  async createUser(userid: string): Promise<User> {
    let user;
    const found = await this.findOne({
      where: {
        id: userid,
      },
    });
    if (!found) {
      user = new User();
      user.id = userid;
      user.nickname = '';
      user.win = 0;
      user.lose = 0;
      user.admin = false;
      user.avatarPath =
        'src/assets/profile' + Math.floor(Math.random() * 4) + '.svg';
      user.rating = 1000;
      user.twoFactorAuthenticationSecret = '';
      user.isTwoFactorAuthenticationEnabled = false;
      user.ladder_win = 0;
      user.ladder_lose = 0;
      user.status = UserStatusType.SIGNUP;
      await this.save(user);
    } else {
      throw new HttpException('Exist id', 409);
    }
    return user;
  }

  async updateNickname(nick: string, userid: string): Promise<User> {
    const user = await this.getUserById(userid);
    user.nickname = nick;
    await this.update(userid, user);
    return user;
  }

  async updateAvatarPath(userid: string, avatarPath: string): Promise<User> {
    const user = await this.getUserById(userid);
    user.avatarPath = avatarPath;
    await this.update(userid, user);
    return user;
  }

  async updateStatus(user: User, type: UserStatusType): Promise<User> {
    user.status = type;
    await this.update(user.id, user);
    return user;
  }

  async getLoginUserList(): Promise<User[]> {
    const list = await this.find({
      where: {
        status: UserStatusType.ONLINE,
      },
    });
    return list;
  }

  async updateLadderGameRecord(user: User): Promise<User> {
    await this.update(user.id, user);
    return user;
  }

  async updateNormalGameRecord(user: User): Promise<User> {
    await this.update(user.id, user);
    return user;
  }
}
