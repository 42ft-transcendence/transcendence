import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { UsersService } from 'src/users/users.service';

@Controller('file')
export class FileController {
  constructor(private usersService: UsersService) {}

  @Post('/fileUpload')
  @UseGuards(JwtTwoFactorGuard)
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      imageURL: `${process.env.BASE_URL}/files/profiles/${file.filename}`,
    };
    console.log(`파일이 업로드 됐습니다.: ${response.imageURL}`);
    return response;
  }

  @Delete('deleteImage')
  @UseGuards(JwtTwoFactorGuard)
  async deleteImage(@Request() req) {
    const result = await this.usersService.deleteAvatar(req.user.id);
    console.log(result);
    return result;
  }
}
