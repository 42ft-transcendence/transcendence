import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactorAuthenticationService } from 'src/auth/2FA/twoFactorAuthentication.service';
import { AuthModule } from 'src/auth/auth.module';
import { ChattingModule } from 'src/chatting/chatting.module';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtTwoFactorStrategy } from 'src/auth/jwt/jwt-two-factor.strategy';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    MulterModule.register({
      dest: './src/users/avatar',
    }),
    AuthModule,
    ChattingModule,
    GameModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
