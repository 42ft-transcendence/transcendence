import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';

@CustomRepository(Message)
export class MessageRepository extends Repository<Message> {
  async saveMessage(
    userId: string,
    content: string,
    channelId: string,
  ): Promise<Message> {
    const message = new Message();
    message.userId = userId;
    message.content = content;
    message.channelId = channelId;
    console.log(message);
    return await this.save(message);
  }

  async getMessages(channelId: string): Promise<Message[]> {
    // 해당 채널의 모든 메세지들을 가져온다
    return await this.find({
      where: {
        channelId: channelId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }
}
