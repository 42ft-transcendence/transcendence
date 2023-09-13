import { Injectable } from '@nestjs/common';
import { GameRoom, GameRoomType } from './game.room';
import { GameGateway } from './game.gateway';

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

  editGameRoomName(roomURL: string, roomName: string): void {
    const room = this.getGameRoom(roomURL);
    if (room) room.roomName = roomName;
  }

  editGameRoomType(roomURL: string, roomType: GameRoomType): void {
    const room = this.getGameRoom(roomURL);
    if (room) room.roomType = roomType;
  }

  editGameRoomPassword(roomURL: string, roomPassword: string): void {
    const room = this.getGameRoom(roomURL);
    if (room) room.roomPassword = roomPassword;
  }

  editGameRoomGameMode(roomURL: string, gameMode: string): void {
    const room = this.getGameRoom(roomURL);
    if (room) room.gameMode = gameMode;
  }

  editGameRoomMap(roomURL: string, map: string): void {
    const room = this.getGameRoom(roomURL);
    if (room) room.map = map;
  }

  editGameRoomUserReady(roomURL: string, userId: string, ready: boolean): void {
    const room = this.getGameRoom(roomURL);
    if (room) {
      const participant = room.participants.find((p) => p.user.id === userId);
      if (participant) participant.ready = ready;
    }
  }
}
