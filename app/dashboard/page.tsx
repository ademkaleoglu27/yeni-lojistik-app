'use client';

import { useEffect, useState } from 'react';

type Firm = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  city: string;
  segment: string;
  note: string;
  createdAt: string;
};

type AjandaItem = {
  id: string;
  firma: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  note: string;
};

type OfferItem = {
  id: string;
  date: string; // ISO
  vade: string;
  discountTR: number;
  discountStation: number;
  note: string;
};

const FIRMS_KEY = 'firms-v1';
const AJANDA_KEY = 'ajanda-items-v1';

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

export default function DashboardPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [searchFirm, setSearchFirm] = useState('');

  // Yeni müşteri form state
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [segment, setSegment] = useState('');
  const [note, setNote] = useState('');

  // Özet alanları
  const [todayMeetCount, setTodayMeetCount] = useState(0);
  const [totalOfferCount, setTotalOfferCount] = useState(0);

  // Seçilen müşteri (detay paneli için)
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);
  const [selectedAjanda, setSelectedAjanda] = useState<AjandaItem[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<OfferItem[]>([]);

  // İlk yüklemede firmalar + özetleri çek
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Firmalar
    try {
      const raw = localStorage.getItem(FIRMS_KEY);
      if (raw) {
        const list = JSON.parse(raw) as Firm[];
        const sorted = [...list].sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        );
        setFirms(sorted);
        if (sorted.length > 0) {
          setSelectedFirm(sorted[0]); // ilk müşteriyi otomatik seç
        }
      }
    } catch {}

    // Ajanda (bugünkü görüşme sayısı)
    try {
      const raw = localStorage.getItem(AJANDA_KEY);
      if (raw) {
        const items = JSON.parse(raw) as AjandaItem[];
        const todayStr = new Date().toISOString().slice(0, 10);
        const today = items.filter((x) => x.date === todayStr);
        setTodayMeetCount(today.length);
      }
    } catch {}

    // Teklif sayısı
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('offers-')) {
          const rawOffers = localStorage.getItem(key);
          if (rawOffers) {
            const list = JSON.parse(rawOffers) as OfferItem[];
            total += list.length;
          }
        }
      }
      setTotalOfferCount(total);
    } catch {}
  }, []);

  // Seçilen müşteri değişince: ajanda + tekliflerini çek
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!selectedFirm) {
      setSelectedAjanda([]);
      setSelectedOffers([]);
      return;
    }

    try {
      // Ajanda
      const rawA = localStorage.getItem(AJANDA_KEY);
      if (rawA) {
        const all = JSON.parse(rawA) as AjandaItem[];
        const filtered = all.filter(
          (it) =>
            it.firma.trim().toLowerCase() ===
            selectedFirm.name.trim().toLowerCase()
        );
        setSelectedAjanda(filtered);
      } else {
        setSelectedAjanda([]);
      }

      // Teklifler
      const offerKey = `offers-${slugify(selectedFirm.name)}`;
      const rawO = localStorage.getItem(offerKey);
      if (rawO) {
        const arr = JSON.parse(rawO) as OfferItem[];
        arr.sort((a, b) => b.date.localeCompare(a.date));
        setSelectedOffers(arr);
      } else {
        setSelectedOffers([]);
      }
    } catch {
      setSelectedAjanda([]);
      setSelectedOffers([]);
    }
  }, [selectedFirm]);

  const saveFirms = (list: Firm[]) => {
    setFirms(list);
    localStorage.setItem(FIRMS_KEY, JSON.stringify(list));
  };

  const handleAddFirm = () => {
    if (!name.trim()) return;

    const newFirm: Firm = {
      id: crypto.randomUUID(),
      name: name.trim(),
      contact: contact.trim(),
      phone: phone.trim(),
      city: city.trim(),
      segment: segment.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newFirm, ...firms];
    saveFirms(updated);

    setName('');
    setContact('');
    setPhone('');
    setCity('');
    setSegment('');
    setNote('');
    setSelectedFirm(newFirm);
  };

  const filteredFirms = firms.filter((f) => {
    if (!searchFirm.trim()) return true;
    const s = searchFirm.trim().toLowerCase();
    return (
      f.name.toLowerCase().includes(s) ||
      f.contact.toLowerCase().includes(s) ||
      f.city.toLowerCase().includes(s) ||
      f.segment.toLowerCase().includes(s) ||
      f.note.toLowerCase().includes(s) ||
      f.phone.toLowerCase().includes(s)
    );
  });

  return (
    <main className="dashboard">
      <div className="dashboard-inner">
        <h1 className="dashboard-title">CRM / Müşteri Yönetimi</h1>
        <p className="dashboard-subtitle">
          Müşterilerini yönet, yeni müşteri ekle, seçili müşteri için ajanda ve teklif
          geçmişini aynı ekranda gör.
        </p>

        {/* Özet kartlar */}
        <div className="dashboard-summary">
          <div className="summary-card">
            <div className="summary-label">Toplam Müşteri</div>
            <div className="summary-value">{firms.length}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Bugünkü Görüşme</div>
            <div className="summary-value">{todayMeetCount}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Toplam Teklif</div>
            <div className="summary-value">{totalOfferCount}</div>
          </div>
        </div>

        {/* Yeni müşteri ekleme */}
        <h2 className="dashboard-recent-title">Yeni Müşteri Kaydı</h2>

        <div className="teklif-form">
          <div className="field">
            <label>Firma Adı</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label>Yetkili</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>

          <div className="field">
            <label>Telefon</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="field">
            <label>Şehir</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="field">
            <label>Sektör</label>
            <input value={segment} onChange={(e) => setSegment(e.target.value)} />
          </div>

          <div className="field" style={{ gridColumn: '1/-1' }}>
            <label>Not</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <button
          className="po-link"
          style={{ marginBottom: '1rem' }}
          onClick={handleAddFirm}
        >
          Müşteri Ekle
        </button>

        {/* Alt layout: solda liste, sağda detay */}
        <div className="firm-detail-wrapper">
          {/* Sol: Müşteri listesi */}
          <div className="firm-detail-left">
            <h2 className="dashboard-recent-title">Mevcut Müşteriler</h2>

            <div className="search-row">
              <input
                className="search-input"
                placeholder="Müşteri ara..."
                value={searchFirm}
                onChange={(e) => setSearchFirm(e.target.value)}
              />
            </div>

            <div className="firm-list">
              {filteredFirms.length === 0 ? (
                <p className="offer-hint">Hiç müşteri bulunamadı.</p>
              ) : (
                filteredFirms.map((f) => (
                  <div
                    key={f.id}
                    className={
                      'firm-card ' +
                      (selectedFirm && selectedFirm.id === f.id
                        ? 'firm-card-active'
                        : '')
                    }
                    onClick={() => setSelectedFirm(f)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="firm-row">
                      <span className="firm-name">{f.name}</span>
                      <span className="firm-meta">
                        {new Date(f.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    <div className="firm-row">
                      <span>
                        {f.contact || '-'} {f.phone && `• ${f.phone}`}
                      </span>
                    </div>

                    <div className="firm-row">
                      <span>{f.city || ''}</span>
                      <span>{f.segment || ''}</span>
                    </div>

                    {f.note && <p className="firm-note">Not: {f.note}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sağ: Seçili müşterinin detayı */}
          <div className="firm-detail-right">
            {selectedFirm ? (
              <>
                <h2 className="dashboard-recent-title">
                  Seçili Müşteri: {selectedFirm.name}
                </h2>

                <div className="firm-card" style={{ marginBottom: '0.6rem' }}>
                  <div className="firm-row">
                    <span className="firm-name">{selectedFirm.name}</span>
                    <span className="firm-meta">
                      {selectedFirm.createdAt
                        ? new Date(selectedFirm.createdAt).toLocaleDateString(
                            'tr-TR'
                          )
                        : ''}
                    </span>
                  </div>
                  <div className="firm-row">
                    <span>
                      {selectedFirm.contact || '-'}{' '}
                      {selectedFirm.phone && `• ${selectedFirm.phone}`}
                    </span>
                  </div>
                  <div className="firm-row">
                    <span>{selectedFirm.city || ''}</span>
                    <span>{selectedFirm.segment || ''}</span>
                  </div>
                  {selectedFirm.note && (
                    <p className="firm-note">Not: {selectedFirm.note}</p>
                  )}
                </div>

                <div className="firm-detail-layout">
                  <div className="firm-detail-section">
                    <h3>Ajanda Kayıtları</h3>
                    {selectedAjanda.length === 0 ? (
                      <p className="offer-hint">
                        Bu firmaya ait ajanda kaydı yok. Ajanda ekranından ekleyebilirsin.
                      </p>
                    ) : (
                      <div className="ajanda-list">
                        {selectedAjanda.map((it) => (
                          <div key={it.id} className="ajanda-item">
                            <div className="ajanda-row">
                              <span className="ajanda-date">
                                {it.date} {it.time && `• ${it.time}`}
                              </span>
                            </div>
                            <div className="ajanda-row">
                              <span>{it.title}</span>
                            </div>
                            {it.note && (
                              <p className="ajanda-note">Not: {it.note}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="firm-detail-section">
                    <h3>Teklif Geçmişi</h3>
                    {selectedOffers.length === 0 ? (
                      <p className="offer-hint">
                        Bu firmaya ait kayıtlı teklif yok. Teklif Kayıt ekranından
                        kaydedebilirsin.
                      </p>
                    ) : (
                      <div className="offer-list">
                        {selectedOffers.map((o) => (
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
                                % Anlaşmalı iskonto:{' '}
                                {o.discountStation.toFixed(2)}
                              </span>
                            </div>
                            {o.note && (
                              <p className="offer-note">Not: {o.note}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="offer-hint" style={{ marginTop: '1.5rem' }}>
                Sağ tarafta detay görmek için soldan bir müşteri seçin.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
