import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageRepository } from './repository/message.repository';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async saveMessage(
    userId: string,
    content: string,
    channelId: string,
  ): Promise<Message> {
    return await this.messageRepository.saveMessage(userId, content, channelId);
  }

  async getMessages(channelId: string): Promise<Message[]> {
    return await this.messageRepository.getMessages(channelId);
  }
}
