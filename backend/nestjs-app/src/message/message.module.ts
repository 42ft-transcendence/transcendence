import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { MessageRepository } from './repository/message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageRepository]),
    TypeOrmExModule.forCustomRepository([MessageRepository]),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
