import { Stream } from 'stream';

export async function streamToBuffer(stream: Stream) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(err));
  });
}
