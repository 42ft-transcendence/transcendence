import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export type GameRoomType = 'PUBLIC' | 'PROTECTED' | 'PRIVATE' | 'CREATING' | '';

export interface GameRoomParticipant {
  user: User;
  ready: boolean;
}

export enum GameRoomStatus {
  WAITING = 0,
  GAMING = 1,
}

export interface GameRoom {
  roomURL: string;
  roomName: string;
  roomType: GameRoomType;
  roomPassword: string;
  roomOwner: User;
  numberOfParticipants: number;
  gameMode: string;
  map: string;
  participants: GameRoomParticipant[];
  status: GameRoomStatus;
}

@Injectable()
export class GameService {
  private rooms: GameRoom[] = [];

  createGameRoom(gameRoom: GameRoom): void {
    this.rooms.push(gameRoom);
  }

  getAllGameRooms(): GameRoom[] {
    return this.rooms;
  }

  deleteGameRoom(roomURL: string): void {
    this.rooms = this.rooms.filter((room) => room.roomURL !== roomURL);
  }

  editGameRoomName(roomURL: string, roomName: string): void {
    const room = this.rooms.find((room) => room.roomURL === roomURL);
    if (!room) return;
    room.roomName = roomName;
  }

  editGameRoomType(roomURL: string, roomType: GameRoomType): void {
    const room = this.rooms.find((room) => room.roomURL === roomURL);
    if (!room) return;
    room.roomType = roomType;
  }

  editGameRoomPassword(roomURL: string, roomPassword: string): void {
    const room = this.rooms.find((room) => room.roomURL === roomURL);
    if (!room) return;
    room.roomPassword = roomPassword;
  }

  editGameRoomGameMode(roomURL: string, gameMode: string): void {
    const room = this.rooms.find((room) => room.roomURL === roomURL);
    if (!room) return;
    room.gameMode = gameMode;
  }

  editGameRoomMap(roomURL: string, map: string): void {
    const room = this.rooms.find((room) => room.roomURL === roomURL);
    if (!room) return;
    room.map = map;
  }

  editGameRoomUserReady(roomURL: string, userId: string, ready: boolean): void {
    this.rooms
      .find((room) => room.roomURL === roomURL)
      .participants.find(
        (participant) => participant.user.id === userId,
      ).ready = ready;
    console.log(
      'edit ready',
      this.rooms.find((room) => room.roomURL === roomURL).participants,
    );
    // if (!room) return;
    // const participant = room.participants.find(
    //   (participant) => participant.user.id === userId,
    // );
    // if (!participant) return;
    // participant.ready = ready;
    // console.log('edit ready', room.participants);
    // console.log(
    //   'edit ready',
    //   this.rooms.find((room) => room.roomURL === roomURL).participants,
    // );
  }
}
