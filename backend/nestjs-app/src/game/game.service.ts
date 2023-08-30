import { Injectable } from '@nestjs/common';
import { ChattingGateway } from 'src/chatting/chatting.gateway';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  constructor(
    private usersService: UsersService,
    private rootGateway: ChattingGateway,
  ) {}
}
