import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { Relationship } from './entities/relationship.entity';
import { RelationshipRepository } from './repository/relationship.repository';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/repository/user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([Relationship]),
    TypeOrmExModule.forCustomRepository([
      RelationshipRepository,
      UserRepository,
    ]),
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService, UsersService],
})
export class RelationshipModule {}
