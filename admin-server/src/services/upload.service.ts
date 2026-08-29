import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
  fileFilter: (_req, file, cb) => {
    // Accept all standard image types
    if (file.mimetype.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg|avif|bmp|tiff|heic|heif)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(null, true); // Permissive upload for all image formats
    }
  },
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format?: string;
}

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'products',
  originalName: string = 'image.jpg'
): Promise<UploadResult> => {
  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name';

  if (hasCloudinary) {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `naturesmud/${folder}` },
          (error, res) => {
            if (error || !res) reject(error || new Error('Upload failed'));
            else resolve(res);
          }
        );
        stream.end(fileBuffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width || 800,
        height: result.height || 800,
        format: result.format,
      };
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local storage handler:', err);
    }
  }

  // Fallback local storage saving
  try {
    const rawExt = path.extname(originalName) || '.jpg';
    const ext = rawExt.toLowerCase();
    const cleanName = path.basename(originalName, rawExt).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30) || 'upload';
    const filename = `${cleanName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;

    // Target both root project public/uploads, cPanel public_html/uploads, and local admin-server public/uploads
    const targetDirs = [
      path.resolve(process.cwd(), 'public', 'uploads'),
      path.resolve(process.cwd(), '..', 'public', 'uploads'),
      path.resolve(process.cwd(), '..', 'public_html', 'uploads'),
      path.resolve(process.cwd(), '..', 'frontend', 'public', 'uploads'),
      '/home8/kathma13/public_html/uploads',
      '/home8/kathma13/frontend/public/uploads',
      path.resolve(__dirname, '../../../public/uploads'),
      path.resolve(__dirname, '../../public/uploads'),
    ];

    targetDirs.forEach((dir) => {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, filename), fileBuffer);
      } catch {
        // Continue if one path isn't writable
      }
    });

    return {
      url: `/uploads/${filename}`,
      publicId: filename,
      width: 800,
      height: 800,
      format: ext.replace('.', ''),
    };
  } catch (e) {
    // If filesystem write fails, fallback to Base64 data URI
    const mime = originalName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const base64 = `data:${mime};base64,${fileBuffer.toString('base64')}`;
    return {
      url: base64,
      publicId: `upload-${Date.now()}`,
      width: 800,
      height: 800,
    };
  }
};
