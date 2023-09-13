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
      user.avatarPath = `${
        process.env.BASE_URL
      }/files/profiles/profile${Math.floor(Math.random() * 5)}.png`;
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

  updateLadderGameRecord(user: User) {
    this.update(user.id, user);
  }

  updateNormalGameRecord(user: User) {
    this.update(user.id, user);
  }

  // 더미 유저 생성
  async createDummyUser(userEntity: User): Promise<void> {
    await this.save(userEntity);
  }

  updateRating(user: User, score: number) {
    user.rating += score;
    this.update(user.id, user);
  }
}
