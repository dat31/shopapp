import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseAuth } from 'firebase-admin/firebase-auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 's3/s3.service';
import { FirebaseAdminService } from 'firebase-admin/firebase-admin.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private s3Service: S3Service,
    private adminService: FirebaseAdminService,
  ) {}

  @Get('hello')
  async getHello() {
    return this.appService.getHello();
  }

  @FirebaseAuth()
  @Post('/s3/upload/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImageS3(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.s3Service.uploadFile(req.user.uid, file);
  }

  @FirebaseAuth()
  @Post('/storage/upload/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImageStorage(@UploadedFile() file: Express.Multer.File) {
    return this.adminService.uploadPhotoURL(file);
  }
}
