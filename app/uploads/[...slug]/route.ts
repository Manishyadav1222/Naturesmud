import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const filename = slug.join('/');

  const searchPaths = [
    path.join(process.cwd(), 'public', 'uploads', filename),
    path.join(process.cwd(), 'admin-server', 'public', 'uploads', filename),
    path.resolve(__dirname, '../../../../public/uploads', filename),
    path.resolve(__dirname, '../../../../admin-server/public/uploads', filename),
  ];

  for (const filePath of searchPaths) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const fileBuffer = fs.readFileSync(filePath);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  return new NextResponse('File Not Found', { status: 404 });
}
