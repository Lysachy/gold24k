import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const sku = formData.get('sku') as string;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram bot token or chat ID is missing.");
      return NextResponse.json({ error: 'Telegram configuration is missing' }, { status: 500 });
    }

    // Prepare FormData for Telegram
    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', chatId);
    telegramFormData.append('photo', file);
    if (sku) {
      telegramFormData.append('caption', `SKU Produk Baru: **${sku}**`);
      telegramFormData.append('parse_mode', 'Markdown');
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      body: telegramFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Telegram API Error:", data);
      return NextResponse.json({ error: 'Failed to send to Telegram' }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in /api/telegram:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
