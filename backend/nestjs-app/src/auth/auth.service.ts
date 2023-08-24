import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getResourceOwnerGoogleId(code: string): Promise<string> {
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          'https://oauth2.googleapis.com/token',
          {
            code: code,
            client_id: this.configService.get('GOOGLE_CLIENT_ID'),
            client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
            redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI'),
            grant_type: 'authorization_code',
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );
      if (resp.status == 200) {
        const ret = await firstValueFrom(
          this.httpService.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
              headers: {
                Authorization: 'Bearer ' + resp.data.access_token,
              },
            },
          ),
        );
        if (ret.status == 200) return ret.data.id;
        else return '-1';
      } else {
        return '-1';
      }
    } catch (error) {
      return '-1';
    }
  }

  async getResourceOwner42Id(code: string): Promise<string> {
    try {
      const resp = await firstValueFrom(
        this.httpService.post(
          'https://api.intra.42.fr/oauth/token',
          {
            grant_type: 'authorization_code',
            client_id: this.configService.get('ClIENT_42_ID'),
            client_secret: this.configService.get('CLIENT_42_SECRET'),
            code: code,
            redirect_uri: this.configService.get('42_REDIRECT_URI'),
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

      if (resp.status == 200) {
        const ret = await firstValueFrom(
          this.httpService.get('https://api.intra.42.fr/oauth/token/info', {
            headers: {
              Authorization: 'Bearer ' + resp.data.access_token,
            },
          }),
        );
        if (ret.status == 200) return ret.data.resource_owner_id;
        else return '-1';
      } else {
        return '-1';
      }
    } catch (error) {
      return '-1';
    }
  }

  async sign(payload: object) {
    const jwt = await this.jwtService.sign(payload);
    return jwt;
  }

  async jwtVerify(token: string): Promise<object> {
    try {
      const ret = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      return ret;
    } catch (e) {
      new HttpException('Token Expired Error', 409);
    }
  }
}
