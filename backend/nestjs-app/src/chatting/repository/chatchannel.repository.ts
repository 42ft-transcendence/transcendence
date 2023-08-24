import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { ChatChannel } from '../entities/chatchannel.entity';
import { Repository } from 'typeorm';
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
      throw new Error(`Room with id ${id} not found`);
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

  async joinChatChannel(
    channel: ChatChannel,
    participant: Participants,
  ): Promise<ChatChannel> {
    const room2 = await this.findOne({
      relations: ['participants'],
      where: { id: channel.id },
    });
    room2.participants = [...(channel.participants || []), participant];
    return await this.save(room2);
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
}
