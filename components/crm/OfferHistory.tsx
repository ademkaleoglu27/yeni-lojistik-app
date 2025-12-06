'use client';

import { useEffect, useState } from 'react';

type Offer = {
  id: string;
  date: string; // ISO string
  vade: string;
  discountTR: number;
  discountStation: number;
  note: string;
};

function storageKey(firma: string) {
  const clean = firma.trim().toLowerCase().replace(/\s+/g, '-');
  return `offers-${clean || 'bos-firma'}`;
}

export default function OfferHistory({ firmaAdi }: { firmaAdi: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [vade, setVade] = useState('30 gün');
  const [discountTR, setDiscountTR] = useState('3');
  const [discountStation, setDiscountStation] = useState('7');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');

  // Firma değişince localStorage'dan teklifleri yükle
  useEffect(() => {
    if (!firmaAdi.trim()) {
      setOffers([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(firmaAdi));
      if (!raw) {
        setOffers([]);
        return;
      }
      const parsed = JSON.parse(raw) as Offer[];
      setOffers(parsed);
    } catch {
      setOffers([]);
    }
  }, [firmaAdi]);

  // Kayıtları localStorage'a yaz
  const saveOffers = (items: Offer[]) => {
    setOffers(items);
    if (!firmaAdi.trim()) return;
    localStorage.setItem(storageKey(firmaAdi), JSON.stringify(items));
  };

  const handleAdd = () => {
    if (!firmaAdi.trim()) return;

    const dTR = parseFloat(discountTR.replace(',', '.')) || 0;
    const dSt = parseFloat(discountStation.replace(',', '.')) || 0;

    const newOffer: Offer = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      vade: vade || '-',
      discountTR: dTR,
      discountStation: dSt,
      note: note.trim(),
    };

    const updated = [newOffer, ...offers];
    saveOffers(updated);

    // formu biraz temizle
    setNote('');
  };

  const hasFirma = firmaAdi.trim().length > 0;

  const filteredOffers = offers.filter((o) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      o.vade.toLowerCase().includes(s) ||
      o.note.toLowerCase().includes(s) ||
      o.discountTR.toString().includes(s) ||
      o.discountStation.toString().includes(s)
    );
  });

  return (
    <div className="offer-box">
      <h2 className="offer-title">Teklif Geçmişi</h2>
      {!hasFirma && (
        <p className="offer-hint">
          Önce yukarıdan firma adını girin. Bu ekranda o firmaya verilen tekliflerin
          geçmişini tutabilirsiniz.
        </p>
      )}

      {hasFirma && (
        <>
          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder="Vade, iskonto veya not içinde ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="offer-form">
            <div className="field">
              <label>Vade</label>
              <input
                type="text"
                value={vade}
                onChange={(e) => setVade(e.target.value)}
                placeholder="Örn: 30 gün"
              />
            </div>
            <div className="field">
              <label>Türkiye Geneli İskonto (%)</label>
              <input
                type="number"
                value={discountTR}
                onChange={(e) => setDiscountTR(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Anlaşmalı İstasyon İskonto (%)</label>
              <input
                type="number"
                value={discountStation}
                onChange={(e) => setDiscountStation(e.target.value)}
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Not (opsiyonel)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Örn: İlk görüşmede kabul etmedi, 1 ay sonra arama"
              />
            </div>
          </div>

          <button
            type="button"
            className="po-link"
            style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
            onClick={handleAdd}
          >
            Bu Teklifi Kaydet
          </button>

          {filteredOffers.length === 0 ? (
            <p className="offer-hint">
              Bu kritere uygun kayıtlı teklif yok. Yeni bir teklif ekleyebilir veya
              arama kutusunu temizleyebilirsiniz.
            </p>
          ) : (
            <div className="offer-list">
              {filteredOffers.map((o) => (
                <div key={o.id} className="offer-item">
                  <div className="offer-row">
                    <span className="offer-date">
                      {new Date(o.date).toLocaleString('tr-TR')}
                    </span>
                    <span className="offer-vade">{o.vade}</span>
                  </div>
                  <div className="offer-row">
                    <span>% TR iskonto: {o.discountTR.toFixed(2)}</span>
                    <span>
                      % Anlaşmalı iskonto: {o.discountStation.toFixed(2)}
                    </span>
                  </div>
                  {o.note && <p className="offer-note">Not: {o.note}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
