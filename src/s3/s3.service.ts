import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'routes/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  s3Client = new S3Client({
    region: 'us-east-1',
  });

  async uploadFile(uid: User['uid'], file: Express.Multer.File) {
    const bucket = this.configService.get('S3_BUCKET');
    const extension = this.getFileExtension(file.originalname);
    const fileName = `${uuidv4()}.${extension}`;
    const key = `${uid}/${fileName}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
      }),
    );
    return fileName;
  }

  getSignedUrl(uid: User['uid'], fileName: string) {
    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: `${this.configService.get('S3_BUCKET')}`,
        Key: `${uid}/${fileName}`,
      }),
      { expiresIn: 60 },
    );
  }

  private getFileExtension(fileName: string) {
    return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  }
}
