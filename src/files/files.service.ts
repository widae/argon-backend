import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../env.validation';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BufferUpload } from './interfaces/buffer-upload.interface';

@Injectable()
export class FilesService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService<EnvVars, true>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.client = new S3Client();

    this.bucket = this.configService.get('AWS_S3_BUCKET', {
      infer: true,
    });
  }

  async createFile(key: string, { mimetype, buffer }: BufferUpload) {
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimetype,
      Body: buffer,
    });

    await this.client.send(cmd);
  }

  async deleteFile(key: string) {
    const cmd = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(cmd);
  }

  /**
   * 키를 URL로 변경
   *
   * @param key 키
   * @return URL 프라미스
   * @throws Signed URL 함수 호출시 오류 발생할 수 있음
   */
  async keyToUrl(key: string) {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.client, cmd, { expiresIn: 900 });
  }
}
