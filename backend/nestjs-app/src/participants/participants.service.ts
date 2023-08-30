import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatChannel } from 'src/chatting/entities/chatchannel.entity';
import { ParticipantsRepository } from './repository/participants.repository';
import { User } from 'src/users/entities/user.entity';
import { Participants } from './entities/participants.entity';
import { ChatChannelRepository } from 'src/chatting/repository/chatchannel.repository';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(ParticipantsRepository)
    private participantRepository: ParticipantsRepository,
    private channelRepository: ChatChannelRepository,
  ) {}

  async addParticipant(
    admin: boolean,
    user: User,
    channel: ChatChannel,
    owner: boolean,
  ): Promise<Participants> {
    const exist = await this.participantRepository.getParticipant(
      user,
      channel,
    );
    if (!exist) {
      const participant = await this.participantRepository.addParticipant(
        admin,
        user,
        channel,
        owner,
      );
      return participant;
    }
  }

  async getAdmin(user: User, channel: ChatChannel) {
    const getCp = await this.participantRepository.getParticipant(
      user,
      channel,
    );
    if (getCp) {
      const tf = await this.participantRepository.getAdmin(getCp);
      return tf;
    }
    return false;
  }

  async changeAdmin(user: User, channel: ChatChannel) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    getCp = await this.participantRepository.changeAdmin(getCp);
    return getCp;
  }

  async changeMuted(user: User, channel: ChatChannel, value: boolean) {
    let getCp = await this.participantRepository.getParticipant(user, channel);
    if (!getCp) {
      throw new HttpException('Invalid channel participant', 455);
    } else if (getCp.admin) {
      throw new HttpException('Admin cannot be muted', 455);
    }
    getCp = await this.participantRepository.changeMuted(getCp, value);
    return getCp;
  }

  async getParticipant(user: User, channel: ChatChannel) {
    const getCp = await this.participantRepository.getParticipant(
      user,
      channel,
    );
    return getCp;
  }

  async channel(user: User): Promise<ChatChannel[]> {
    const channel = await this.participantRepository.getChannelByUser(user);
    const channelReturn = [];
    for (const i of channel) {
      const channel = await this.channelRepository.getChannelById(i.id);
      channelReturn.push(channel);
    }
    return channelReturn;
  }

  async getOwnerChannel(user: User) {
    return await this.participantRepository.getOwnerChannel(user);
  }

  async getAllParticipants(channel: ChatChannel): Promise<Participants[]> {
    return await this.participantRepository.getParticipantsByChannel(channel);
  }

  async deleteParticipant(user: User, channel: ChatChannel) {
    const getCp = await this.participantRepository.getParticipant(
      user,
      channel,
    );
    if (getCp) {
      await this.participantRepository.deleteParticipant(getCp);
    } else {
      throw new HttpException('Invalid channel participant ( Not Exist)', 455);
    }
    return true;
  }

  async deleteAllParticipant(channel: ChatChannel) {
    const getCp =
      await this.participantRepository.getParticipantsByChannel(channel);
    if (getCp) {
      await this.participantRepository.deleteAllParticipant(getCp);
    } else {
      throw new HttpException('Invalid channel participant ( Not Exist)', 455);
    }
    return true;
  }
}
