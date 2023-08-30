import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessage } from './entities/directmessage.entity';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { DirectMessageRepository } from './repository/directmessage.repository';
import { DirectMessageService } from './directmessage.service';
import { DirectMessageController } from './directmessage.controller';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectMessage]),
    TypeOrmExModule.forCustomRepository([
      DirectMessageRepository,
      UserRepository,
    ]),
  ],
  controllers: [DirectMessageController],
  providers: [DirectMessageService, UsersService],
})
export class DMModule {}
