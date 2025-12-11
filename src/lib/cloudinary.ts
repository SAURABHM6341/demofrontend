import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export function uploadStream(options: { folder?: string } = {}) {
  return cloudinary.uploader.upload_stream({ folder: options.folder || "transporters" });
}

export async function uploadFileFromBuffer(buffer: Buffer, folder?: string) {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || "transporters" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const passthrough = require("stream").PassThrough();
    passthrough.end(buffer);
    passthrough.pipe(stream);
  });
}

export default cloudinary;
