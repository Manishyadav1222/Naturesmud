import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf']);

function detectMagicByteExtension(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return '.jpg';
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return '.png';
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return '.webp';
  }
  // PDF: "%PDF-"
  if (buffer.length >= 5 && buffer.toString('ascii', 0, 5) === '%PDF-') {
    return '.pdf';
  }
  return null;
}

/**
 * POST /api/upload/receipt
 * Accepts a multipart form upload of a payment receipt (image or PDF),
 * validates size, extension, MIME type, and magic bytes, and saves it to public/uploads/receipts/.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('receipt') as File | null;

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { success: false, message: 'No receipt file uploaded.' },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { success: false, message: 'Uploaded receipt file is empty.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Receipt file exceeds the 5 MB maximum size limit.' },
        { status: 400 }
      );
    }

    const rawExt = path.extname(file.name || '').toLowerCase();
    const mimeType = (file.type || '').toLowerCase();

    if (rawExt && !ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported file extension. Allowed formats: JPG, PNG, WEBP, or PDF.',
        },
        { status: 400 }
      );
    }

    if (mimeType && !ALLOWED_MIME_TO_EXT[mimeType]) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported file type. Allowed formats: JPG, PNG, WEBP, or PDF.',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const detectedExt = detectMagicByteExtension(buffer);
    if (!detectedExt) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file signature. Please upload a genuine JPG, PNG, WEBP image or PDF receipt.',
        },
        { status: 400 }
      );
    }

    // Create safe unique filename using verified file signature extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `receipt-${uniqueSuffix}${detectedExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/receipts/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: 'Receipt uploaded successfully.',
    });
  } catch (err: any) {
    console.error('[Receipt Upload Error]:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to process receipt upload.' },
      { status: 500 }
    );
  }
}
