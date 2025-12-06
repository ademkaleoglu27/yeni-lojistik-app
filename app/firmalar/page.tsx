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

const STORAGE_KEY = 'firms-v1';

export default function FirmalarPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [segment, setSegment] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');

  // LocalStorage'dan yükle
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Firm[];
      setFirms(parsed);
    } catch {
      // ignore
    }
  }, []);

  const saveFirms = (list: Firm[]) => {
    setFirms(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleAdd = () => {
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
  };

  const filtered = firms.filter((f) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
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
    <div className="teklif-page">
      <h1 className="teklif-title">Müşteri Listesi / CRM</h1>
      <p className="teklif-info">
        Müşterilerinizi buradan yönetin. Yeni firma ekleyin, yetkili ve iletişim
        bilgilerini girin, arama çubuğu ile hızlıca bulun.
      </p>

      {/* Arama çubuğu */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Firma, yetkili, şehir, sektör veya not içinde ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Müşteri ekleme formu */}
      <div className="teklif-form">
        <div className="field">
          <label>Firma Adı</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: AC Lojistik AŞ"
          />
        </div>
        <div className="field">
          <label>Yetkili Adı</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Örn: Ahmet Çalışkan"
          />
        </div>
        <div className="field">
          <label>Telefon</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Örn: 05xx xxx xx xx"
          />
        </div>
        <div className="field">
          <label>Şehir</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Örn: İstanbul"
          />
        </div>
        <div className="field">
          <label>Sektör / Segment</label>
          <input
            type="text"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            placeholder="Örn: Lojistik / Turizm"
          />
        </div>
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label>Not (opsiyonel)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Örn: Filoda 20 araç var, yakıt tüketimi yüksek."
          />
        </div>
      </div>

      <button
        type="button"
        className="po-link"
        style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
        onClick={handleAdd}
      >
        Müşteri Ekle
      </button>

      {/* Müşteri kartları */}
      <div className="firm-list">
        {filtered.length === 0 ? (
          <p className="offer-hint">
            Kayıtlı müşteri bulunamadı. Yeni müşteri ekleyebilir veya arama
            filtresini temizleyebilirsiniz.
          </p>
        ) : (
          filtered.map((f) => (
            <div key={f.id} className="firm-card">
              <div className="firm-row">
                <span className="firm-name">{f.name}</span>
                <span className="firm-meta">
                  {f.createdAt
                    ? new Date(f.createdAt).toLocaleDateString('tr-TR')
                    : ''}
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
  );
}
