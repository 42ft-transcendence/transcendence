import { Injectable } from '@nestjs/common';
import { GameRoom } from './game.room';

@Injectable()
export class GameService {
  private rooms: GameRoom[] = [];

  createGameRoom(gameRoom: GameRoom): void {
    this.rooms.push(gameRoom);
  }

  getAllGameRooms(): GameRoom[] {
    return this.rooms;
  }

  getAllGameRoomsInfo(): Partial<GameRoom>[] {
    return this.rooms.map((room) => room.getGameRoomInfo());
  }

  getGameRoom(roomURL: string): GameRoom | undefined {
    return this.rooms.find((room) => room.roomURL === roomURL);
  }

  deleteGameRoom(roomURL: string): void {
    this.rooms = this.rooms.filter((room) => room.roomURL !== roomURL);
  }

  editGameRoomMap(roomURL: string, map: string): void {
    const room = this.getGameRoom(roomURL);
    if (room) room.map = map;
  }
}
