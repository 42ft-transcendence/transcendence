import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Room } from '../entities/room.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Participants } from 'src/participants/entities/participants.entity';

@CustomRepository(Room)
export class RoomRepository extends Repository<Room> {
  async getRoomById(id: string): Promise<Room> {
    const room = await this.findOne({
      relations: ['participants'],
      where: { id },
    });
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }
    return room;
  }

  async createRoom(
    name: string,
    owner: User,
    type: string,
    password: string,
  ): Promise<Room> {
    const room = new Room();
    room.name = name;
    room.participants = [];
    room.owner = owner;
    room.messages = [];
    room.type = type;
    room.password = password;
    return await this.save(room);
  }

  async joinRoom(room: Room, participant: Participants): Promise<Room> {
    const room2 = await this.findOne({
      relations: ['participants'],
      where: { id: room.id },
    });
    room2.participants = [...(room.participants || []), participant];
    return await this.save(room2);
  }

  async leaveRoom(room: Room, participant: Participants): Promise<Room> {
    room.participants = room.participants.filter(
      (p) => p.id !== participant.id,
    );
    return await this.save(room);
  }

  async deleteRoom(room: Room): Promise<void> {
    await this.remove(room);
  }
}
