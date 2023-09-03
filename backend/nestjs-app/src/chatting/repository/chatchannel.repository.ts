import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { ChatChannel } from '../entities/chatchannel.entity';
import { Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Participants } from 'src/participants/entities/participants.entity';

@CustomRepository(ChatChannel)
export class ChatChannelRepository extends Repository<ChatChannel> {
  async getChannelById(id: string): Promise<ChatChannel> {
    const channel = await this.findOne({
      relations: ['participants'],
      where: { id },
    });
    if (!channel) {
      throw new Error(`Channel with id ${id} not found`);
    }
    return channel;
  }

  async createChatChannel(
    name: string,
    owner: User,
    type: string,
    password: string,
  ): Promise<ChatChannel> {
    const channel = new ChatChannel();
    channel.name = name;
    channel.participants = [];
    channel.owner = owner;
    channel.messages = [];
    channel.type = type;
    channel.password = password;
    return await this.save(channel);
  }

  async editChatChannel(
    id: string,
    name: string,
    type: string,
    password: string,
  ): Promise<ChatChannel> {
    const channel = await this.findOne({
      where: { id },
    });
    if (!channel) {
      throw new Error('존재하지 않는 채널입니다.');
    }
    channel.name = name;
    channel.type = type;
    channel.password = password;
    return await this.save(channel);
  }

  async joinChatChannel(
    channel: ChatChannel,
    participant: Participants,
  ): Promise<ChatChannel> {
    const channel2 = await this.findOne({
      relations: ['participants'],
      where: { id: channel.id },
    });
    channel2.participants = [...(channel.participants || []), participant];
    return await this.save(channel2);
  }

  async leaveChatChannel(
    channel: ChatChannel,
    participant: Participants,
  ): Promise<ChatChannel> {
    channel.participants = channel.participants.filter(
      (p) => p.id !== participant.id,
    );
    return await this.save(channel);
  }

  async deleteChatChannel(channel: ChatChannel): Promise<void> {
    await this.remove(channel);
  }

  async getAllOpenedChannels(): Promise<ChatChannel[]> {
    return await this.find({
      relations: {
        participants: true,
      },
      where: { type: Not('PRIVATE') },
    });
  }
}
