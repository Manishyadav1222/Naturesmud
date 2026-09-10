import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'Nature_Mud_Product_Catalog.pdf');

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: 'Catalog PDF not found' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(pdfPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="NaturesMud_Himalayan_Master_Magazine_Catalog_2026.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error serving catalog download:', error);
    return NextResponse.json(
      { error: 'Failed to download catalog PDF', details: error.message },
      { status: 500 }
    );
  }
}
