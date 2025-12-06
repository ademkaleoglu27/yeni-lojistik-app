import { NextResponse } from 'next/server';

const BASE_URL = 'https://akaryakit-fiyatlari.vercel.app/api/po';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate') || '34';

  try {
    const res = await fetch(`${BASE_URL}/${plate}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Fiyatlar alınamadı' },
        { status: 500 }
      );
    }

    const data = await res.json();
    // data.sonYenileme ve data.fiyatlar (ilçe, benzin, mazot, lpg) alanlarını aynen öne iletiyoruz
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
