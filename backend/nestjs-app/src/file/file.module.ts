import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileController } from './file.controller';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/database/typeorm-ex-module';
import { UserRepository } from 'src/users/repository/user.repository';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './img_files',
        filename: (req, file, cb) => {
          const uniqueFileName = uuidv4() + extname(file.originalname);
          cb(null, uniqueFileName);
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [FileController],
  providers: [UsersService],
})
export class FileModule {}
