import { PipeTransform, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-minimal';
import { streamToBuffer } from '../../common/utils/stream-to-buffer.util';
import { CustomHttpException } from '../../common/exceptions/custom-http.exception';
import { BufferUpload } from '../interfaces/buffer-upload.interface';
import { FileValidationOptions } from '../interfaces/file-validation-options.interface';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly options: FileValidationOptions | undefined;

  constructor(options?: FileValidationOptions) {
    this.options = options;
  }

  async transform(promise: Promise<FileUpload>): Promise<BufferUpload> {
    const fileUpload = await promise;

    const stream = fileUpload.createReadStream();
    const buffer = await streamToBuffer(stream);

    if (buffer.byteLength === 0) {
      throw new CustomHttpException('E_400_001');
    }

    if (
      this.options?.maxBytes !== undefined &&
      buffer.byteLength > this.options.maxBytes
    ) {
      throw new CustomHttpException('E_400_002');
    }

    if (
      this.options?.mimetypes !== undefined &&
      !this.options.mimetypes.includes(fileUpload.mimetype)
    ) {
      throw new CustomHttpException('E_400_003');
    }

    return {
      filename: fileUpload.mimetype,
      fieldName: fileUpload.fieldName,
      mimetype: fileUpload.mimetype,
      encoding: fileUpload.encoding,
      buffer,
    };
  }
}
