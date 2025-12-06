'use client';

import { useState } from 'react';
import OfferHistory from '../../components/crm/OfferHistory';

export default function TeklifKayitPage() {
  const [firmaAdi, setFirmaAdi] = useState('');

  return (
    <div className="teklif-page">
      <h1 className="teklif-title">Teklif Kayıt / Geçmiş</h1>
      <p className="teklif-info">
        Hızlıca teklif verdiğiniz firmaları ve verdiğiniz oranları kaydedin. Firma
        adını girin, vade ve iskonto oranlarını ekleyin; geçmişi aynı ekranda görün.
      </p>

      <div className="teklif-form">
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label>Firma Adı</label>
          <input
            type="text"
            value={firmaAdi}
            onChange={(e) => setFirmaAdi(e.target.value)}
            placeholder="Örn: AC Lojistik AŞ"
          />
        </div>
      </div>

      <OfferHistory firmaAdi={firmaAdi} />
    </div>
  );
}
