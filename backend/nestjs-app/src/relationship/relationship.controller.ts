import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { RelationshipService } from './relationship.service';
import { UsersService } from 'src/users/users.service';
import { Relationship } from './entities/relationship.entity';
import { User } from 'src/users/entities/user.entity';
import { UserIdDto } from './dto/user-id.dto';

@Controller('relationship')
export class RelationshipController {
  constructor(
    private relationshipService: RelationshipService,
    private usersService: UsersService,
  ) {}

  @Post('friends')
  @UseGuards(JwtTwoFactorGuard)
  async makeFriends(
    @Request() req,
    @Body() userIdDto: UserIdDto,
  ): Promise<Relationship> {
    const self = await this.usersService.getUserById(req.user.id);
    const friend = await this.usersService.getUserById(userIdDto.id);
    return await this.relationshipService.setFriend(self, friend);
  }

  @Get('friends')
  @UseGuards(JwtTwoFactorGuard)
  async getFriends(@Request() req): Promise<User[]> {
    const user = await this.usersService.getUserById(req.user.id);
    return await this.relationshipService.getFrinedsByUser(user);
  }

  @Delete('friends')
  @UseGuards(JwtTwoFactorGuard)
  async deleteFriends(
    @Request() req,
    @Query() userIdDto: UserIdDto,
  ): Promise<void> {
    const self = await this.usersService.getUserById(req.user.id);
    const friend = await this.usersService.getUserById(userIdDto.id);
    return await this.relationshipService.deleteRelation(self, friend);
  }

  @Post('block')
  @UseGuards(JwtTwoFactorGuard)
  async makeBlock(
    @Request() req,
    @Body() userIdDto: UserIdDto,
  ): Promise<Relationship> {
    const self = await this.usersService.getUserById(req.user.id);
    const user = await this.usersService.getUserById(userIdDto.id);
    return await this.relationshipService.setBlock(self, user);
  }

  @Get('block')
  @UseGuards(JwtTwoFactorGuard)
  async getBlock(@Request() req): Promise<User[]> {
    const user = await this.usersService.getUserById(req.user.id);
    return await this.relationshipService.getBlocksByUser(user);
  }

  @Delete('block')
  @UseGuards(JwtTwoFactorGuard)
  async deleteBlock(
    @Request() req,
    @Query() userIdDto: UserIdDto,
  ): Promise<void> {
    const self = await this.usersService.getUserById(req.user.id);
    const user = await this.usersService.getUserById(userIdDto.id);
    return await this.relationshipService.deleteRelation(self, user);
  }
}
