import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export const runtime = 'nodejs';

function toNum(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;

    const firmaAdi = (body.firmaAdi || '').toString();
    const yetkiliAdi = (body.yetkiliAdi || '').toString();
    const discountTR = toNum(body.discountTR);
    const discountStation = toNum(body.discountStation);

    if (!firmaAdi.trim() || !yetkiliAdi.trim()) {
      return NextResponse.json(
        { error: 'Firma adı ve yetkili adı zorunludur.' },
        { status: 400 }
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'TEKLİF FORMU',
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Firma: ', bold: true }),
                new TextRun({ text: firmaAdi }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Yetkili: ', bold: true }),
                new TextRun({ text: yetkiliAdi }),
              ],
            }),

            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Türkiye Geneli İskonto Oranı',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: discountTR
                    ? `%${discountTR.toFixed(2)}`
                    : 'Belirtilmedi',
                }),
              ],
            }),

            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Anlaşmalı İstasyon İskonto Oranı',
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: discountStation
                    ? `%${discountStation.toFixed(2)}`
                    : 'Belirtilmedi',
                }),
              ],
            }),

            new Paragraph({ text: '' }),
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    'Not: Bu teklif, belirtilen iskonto oranlarına göre hazırlanmıştır. Detaylı fiyat ve karlılık hesabı ayrıca paylaşılacaktır.',
                  size: 20,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const safeName =
      firmaAdi.trim().length > 0 ? firmaAdi.trim().replace(/\s+/g, '-') : 'musteri';
    const fileName = `Teklif-${safeName}.docx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (e) {
    console.error('TEKLIF WORD HATASI:', e);
    return NextResponse.json(
      { error: 'Sunucu tarafında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
