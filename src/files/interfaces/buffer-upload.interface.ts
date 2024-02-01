import { FileUpload } from 'graphql-upload-minimal';

export type BufferUpload = Omit<FileUpload, 'createReadStream'> & {
  buffer: Buffer;
};
