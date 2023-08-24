import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { toFileStream } from 'qrcode';
import { IsString } from 'class-validator';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.nickname, 'TEST', secret);

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(code: string, user: User) {
    let ret;

    try {
      ret = authenticator.verify({
        secret: user.twoFactorAuthenticationSecret,
        token: code,
      });
    } catch (error) {
      console.log('twofactorAuthen verify error');
    }
    return ret;
  }
}

export class TwoFactorAuthenticationDto {
  @IsString()
  code: string;
}
