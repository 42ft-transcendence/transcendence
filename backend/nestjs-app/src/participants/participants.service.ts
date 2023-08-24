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
    private roomRepository: ChatChannelRepository,
  ) {}

  async addParticipant(
    admin: boolean,
    user: User,
    room: ChatChannel,
    owner: boolean,
  ): Promise<Participants> {
    const exist = await this.participantRepository.getParticipant(user, room);
    if (!exist) {
      const participant = await this.participantRepository.addParticipant(
        admin,
        user,
        room,
        owner,
      );
      return participant;
    }
  }

  async getAdmin(user: User, room: ChatChannel) {
    const getCp = await this.participantRepository.getParticipant(user, room);
    if (getCp) {
      const tf = await this.participantRepository.getAdmin(getCp);
      return tf;
    }
    return false;
  }

  async changeAdmin(user: User, room: ChatChannel) {
    let getCp = await this.participantRepository.getParticipant(user, room);
    getCp = await this.participantRepository.changeAdmin(getCp);
    return getCp;
  }

  async changeMuted(user: User, room: ChatChannel, value: boolean) {
    let getCp = await this.participantRepository.getParticipant(user, room);
    getCp = await this.participantRepository.changeMuted(getCp, value);
    return getCp;
  }

  async getParticipant(user: User, room: ChatChannel) {
    const getCp = await this.participantRepository.getParticipant(user, room);
    return getCp;
  }

  async getroomByUser(user: User): Promise<ChatChannel[]> {
    const room_for_search =
      await this.participantRepository.getroomByUser(user);
    const room_for_return = [];
    for (const i of room_for_search) {
      const room = await this.roomRepository.getChannelById(i.id);
      room_for_return.push(room);
    }
    return room_for_return;
  }

  async getOwnerroom(user: User) {
    return await this.participantRepository.getOwnerroom(user);
  }

  async getAllParticipants(room: ChatChannel): Promise<Participants[]> {
    return await this.participantRepository.getParticipantsByroom(room);
  }

  async deleteParticipant(user: User, room: ChatChannel) {
    const getCp = await this.participantRepository.getParticipant(user, room);
    if (getCp) {
      await this.participantRepository.deleteParticipant(getCp);
    } else {
      throw new HttpException('Invalid room participant ( Not Exist)', 455);
    }
    return true;
  }
}
