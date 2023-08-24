import { HttpException } from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Room } from 'src/chatting/entities/room.entity';
import { Participants } from '../entities/participants.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(Participants)
export class ParticipantsRepository extends Repository<Participants> {
  async addParticipant(admin: boolean, user: User, room: Room, owner: boolean) {
    const exist = await this.getParticipant(user, room);
    if (!exist) {
      const participant = new Participants();
      participant.admin = admin;
      participant.user = user;
      participant.room = room;
      participant.owner = owner;
      participant.muted = false;
      const ret = await this.save(participant);
      return ret;
    } else {
      throw new HttpException('Already exist user', 409);
    }
  }

  async getParticipant(user2: User, room: Room) {
    const getUser = await this.findOne({
      relations: ['user', 'room'],
      where: { user: { id: user2.id }, room: { id: room.id } },
    });
    return getUser;
  }

  async getParticipantsByroom(room: Room): Promise<Participants[]> {
    const getUser = await this.find({
      relations: ['user', 'room'],
      where: { room: { id: room.id } },
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

  async getroomByUser(user: User): Promise<Room[]> {
    const rooms: Room[] = [];
    const participants = await this.find({
      relations: ['user', 'room'],
      where: {
        user: {
          id: user.id,
        },
      },
    });
    participants.forEach((participant) => {
      rooms.push(participant.room);
    });
    return rooms;
  }
  async getOwnerroom(user: User): Promise<string[]> {
    const rooms: string[] = [];
    const participants = await this.find({
      relations: ['user', 'room'],
      where: {
        owner: true,
        user: {
          id: user.id,
        },
      },
    });
    participants.forEach((participant) => {
      rooms.push(participant.room.id);
    });
    return rooms;
  }

  async deleteParticipant(participant: Participants) {
    await this.delete(participant.id);
  }
}
