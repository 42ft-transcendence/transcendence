import { HttpException } from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { ChatChannel } from 'src/chatting/entities/chatchannel.entity';
import { Participants } from '../entities/participants.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(Participants)
export class ParticipantsRepository extends Repository<Participants> {
  async addParticipant(
    admin: boolean,
    user: User,
    channel: ChatChannel,
    owner: boolean,
  ) {
    const exist = await this.getParticipant(user, channel);
    if (!exist) {
      const participant = new Participants();
      participant.admin = admin;
      participant.user = user;
      participant.channel = channel;
      participant.owner = owner;
      participant.muted = false;
      const ret = await this.save(participant);
      return ret;
    } else {
      throw new HttpException('Already exist user', 409);
    }
  }

  async getParticipant(user2: User, channel: ChatChannel) {
    const getUser = await this.findOne({
      relations: ['user', 'channel'],
      where: { user: { id: user2.id }, channel: { id: channel.id } },
    });
    return getUser;
  }

  async getParticipantsByChannel(
    channel: ChatChannel,
  ): Promise<Participants[]> {
    const getUser = await this.find({
      relations: ['user', 'channel'],
      where: { channel: { id: channel.id } },
    });
    return getUser;
  }

  async getAdmin(cp: Participants) {
    const getCp = await this.findOne({
      where: { id: cp.id },
    });
    return getCp.admin;
  }

  async changeAdmin(cp: Participants) {
    const getCp = await this.findOne({
      where: { id: cp.id },
    });
    getCp.admin = !getCp.admin;
    return await this.save(getCp);
  }

  async changeMuted(cp: Participants, value: boolean) {
    const getCp = await this.findOne({
      where: { id: cp.id },
    });
    getCp.muted = value;
    await this.update(getCp.id, getCp);
    return getCp;
  }

  async getChannelByUser(user: User): Promise<ChatChannel[]> {
    const channel: ChatChannel[] = [];
    const participants = await this.find({
      relations: ['user', 'channel'],
      where: {
        user: {
          id: user.id,
        },
      },
    });
    participants.forEach((participant) => {
      channel.push(participant.channel);
    });
    return channel;
  }
  async getOwnerChannel(user: User): Promise<string[]> {
    const channel: string[] = [];
    const participants = await this.find({
      relations: ['user', 'channel'],
      where: {
        owner: true,
        user: {
          id: user.id,
        },
      },
    });
    participants.forEach((participant) => {
      channel.push(participant.channel.id);
    });
    return channel;
  }

  async deleteParticipant(participant: Participants) {
    await this.delete(participant.id);
  }
}
