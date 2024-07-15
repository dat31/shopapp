import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  s3Client = new S3Client({
    region: 'us-east-1',
  });

  uploadFile(file: Express.Multer.File) {
    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: file.originalname,
        Body: file.buffer,
      }),
    );
  }
}
