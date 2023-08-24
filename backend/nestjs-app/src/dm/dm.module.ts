import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DM } from './entities/dm.entity';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { DMRepository } from './repository/dm.repository';
import { DMService } from './dm.service';
import { DMController } from './dm.controller';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DM]),
    TypeOrmExModule.forCustomRepository([DMRepository, UserRepository]),
  ],
  controllers: [DMController],
  providers: [DMService, UsersService],
})
export class DMModule {}
