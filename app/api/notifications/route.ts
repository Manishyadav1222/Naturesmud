import { NextRequest, NextResponse } from 'next/server';
import { triggerNotification, NotificationPayload } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const payload: NotificationPayload = await req.json();

    if (!payload.event || !payload.recipient?.name || !payload.recipient?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters (event, recipient.name, recipient.phone)' },
        { status: 400 }
      );
    }

    const result = await triggerNotification(payload);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error executing notification automation trigger:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
