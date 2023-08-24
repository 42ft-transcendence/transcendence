import { Injectable } from '@nestjs/common';
import { RoomRepository } from './repository/room.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { ParticipantsService } from 'src/participants/participants.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChattingService {
  constructor(
    @InjectRepository(RoomRepository)
    private readonly roomRepository: RoomRepository,
    private readonly participantsService: ParticipantsService,
  ) {}

  async ownerJoinRoom(
    roomId: string,
    password: string,
    client: Socket,
    user: User,
  ): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, password },
    });
    if (!room) {
      throw new Error('Room not found');
    }
    client.join(roomId);
    const participant = await this.participantsService.addParticipant(
      true,
      user,
      room,
      true,
    );
    await this.roomRepository.joinRoom(room, participant);
  }
}
