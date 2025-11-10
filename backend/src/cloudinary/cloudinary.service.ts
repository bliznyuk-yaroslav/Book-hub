import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    buffer: Buffer,
    folder?: string,
  ): Promise<UploadApiResponse> {
    const stream = Readable.from(buffer);
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: folder || process.env.CLOUDINARY_FOLDER },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve(result);
        },
      );
      stream.pipe(upload);
    });
  }
}
