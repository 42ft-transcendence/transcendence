import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { UserStatusType, ValidNicknameType } from 'src/util';
import * as fs from 'fs-extra';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async updateStatus(user: User, type: UserStatusType): Promise<User> {
    const tmp = await this.userRepository.updateStatus(user, type);
    console.log(
      `change status user: ${tmp.nickname} set status = ${tmp.status}`,
    );
    return tmp;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw 'Token Expired Error'; // 어떤식으로 할지 추 후에 수정
    console.log(`success getUserById: ${user.nickname}`);
    return user;
  }

  async createUser(id: string): Promise<User> {
    const user = await this.userRepository.createUser(id);
    return user;
  }

  async checkUser(id: string): Promise<boolean> {
    return await this.userRepository.checkUser(id);
  }

  async checkValidNickname(nickname: string): Promise<ValidNicknameType> {
    const pattern1 = /^[a-z|A-Z|가-힣|0-9]+$/;
    const pattern2 = /\s/;
    const pattern3 = /[ㄱ-ㅎ|ㅏ-ㅣ]/;
    const returnObj: ValidNicknameType = {
      message: '',
      status: 200,
    };

    if (nickname.length < 2 || nickname.length > 10) {
      returnObj.message = '닉네임의 길이는 2 ~ 10자 입니다.';
      returnObj.status = 400;
    } else if (pattern3.test(nickname)) {
      returnObj.message = '닉네임에 한글 자음 또는 모음만 사용할 수 없습니다.';
      returnObj.status = 400;
    } else if (pattern2.test(nickname)) {
      returnObj.message = '닉네임에 공백을 포함할 수 없습니다.';
      returnObj.status = 400;
    } else if (!pattern1.test(nickname)) {
      returnObj.message = '닉네임에 특수문자를 포함할 수 없습니다.';
      returnObj.status = 400;
    } else {
      const user = await this.userRepository.getUserByNickname(nickname);
      if (user) {
        returnObj.message = '중복된 닉네임 입니다.';
        returnObj.status = 400;
      }
    }
    return returnObj;
  }

  async updateNickname(nickname: string, userid: string): Promise<User> {
    await this.checkValidNickname(nickname);
    const user = await this.userRepository.updateNickname(nickname, userid);
    return user;
  }

  async deleteUserById(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(`User not found with ID ${id}`, 404);
    }
  }

  async getLoginUserList(id: string): Promise<User[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new HttpException(`User not found with ID ${id}`, 404);
    }
    const userList = await this.userRepository.getLoginUserList();
    return userList;
  }

  async updateAvatarPath(userid: string, avatarPath: string): Promise<User> {
    const user = await this.userRepository.updateAvatarPath(userid, avatarPath);
    return user;
  }

  async deleteAvatar(userid: string): Promise<boolean> {
    const user = await this.getUserById(userid);
    try {
      if (user.avatarPath.indexOf('src/assets/profile') !== 0) {
        const modifiedUrl = user.avatarPath.replace('src', '.');
        await fs.unlink(modifiedUrl); // 파일 삭제
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getAllUserList(): Promise<User[]> {
    const userList = await this.userRepository.find({
      order: { status: 'ASC' },
    });
    return userList;
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return await this.userRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return await this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    return await this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
    });
  }
}
