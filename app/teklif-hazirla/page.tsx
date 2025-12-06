'use client';

import { useState } from 'react';

export default function TeklifHazirlaPage() {
  const [firmaAdi, setFirmaAdi] = useState('');
  const [yetkiliAdi, setYetkiliAdi] = useState('');
  const [discountTR, setDiscountTR] = useState('3');
  const [discountStation, setDiscountStation] = useState('7');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const formValid =
    firmaAdi.trim().length > 0 &&
    yetkiliAdi.trim().length > 0 &&
    discountTR.trim().length > 0 &&
    discountStation.trim().length > 0;

  const handleDownload = async () => {
    setError('');

    if (!formValid) {
      setError('Firma, yetkili ve iskonto oranı alanlarını doldurun.');
      return;
    }

    try {
      setDownloading(true);
      const res = await fetch('/api/teklif-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firmaAdi,
          yetkiliAdi,
          discountTR,
          discountStation,
        }),
      });

      if (!res.ok) {
        setError('Teklif dosyası oluşturulurken bir hata oluştu.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Teklif-${firmaAdi || 'musteri'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError('Beklenmeyen bir hata oluştu.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="teklif-page">
      <h1 className="teklif-title">Teklif Hazırla (Word)</h1>
      <p className="teklif-info">
        Firma ve yetkili bilgilerini, Türkiye geneli ve anlaşmalı istasyon iskonto
        oranlarını girin. Sistem sizin için Word formatında teklif oluşturacaktır.
      </p>

      <div className="teklif-form">
        <div className="field">
          <label>Firma Adı</label>
          <input
            type="text"
            value={firmaAdi}
            onChange={(e) => setFirmaAdi(e.target.value)}
            placeholder="Örn: AC Lojistik AŞ"
          />
        </div>

        <div className="field">
          <label>Yetkili Adı</label>
          <input
            type="text"
            value={yetkiliAdi}
            onChange={(e) => setYetkiliAdi(e.target.value)}
            placeholder="Örn: Ahmet Çalışkan"
          />
        </div>

        <div className="field">
          <label>Türkiye Geneli İskonto Oranı (%)</label>
          <input
            type="number"
            value={discountTR}
            onChange={(e) => setDiscountTR(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Anlaşmalı İstasyon İskonto Oranı (%)</label>
          <input
            type="number"
            value={discountStation}
            onChange={(e) => setDiscountStation(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        onClick={handleDownload}
        className="po-link"
        disabled={downloading}
      >
        {downloading ? 'Word Teklif Hazırlanıyor...' : 'Word Teklif İndir'}
      </button>
    </div>
  );
}
