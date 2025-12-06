'use client';

import { useEffect, useState } from 'react';

type EventItem = {
  id: string;
  firma: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  note: string;
};

const STORAGE_KEY = 'ajanda-items-v1';

export default function AjandaPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [firma, setFirma] = useState('');
  const [title, setTitle] = useState('Görüşme');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EventItem[];
      setItems(parsed);
    } catch {
      // ignore
    }
  }, []);

  // save to localStorage
  const saveItems = (list: EventItem[]) => {
    setItems(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleAdd = () => {
    if (!firma.trim() || !date) {
      return;
    }

    const newItem: EventItem = {
      id: crypto.randomUUID(),
      firma: firma.trim(),
      title: title.trim() || 'Görüşme',
      date,
      time,
      note: note.trim(),
    };

    const updated = [...items, newItem].sort((a, b) =>
      (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time)
    );
    saveItems(updated);

    setNote('');
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const filtered = items.filter((it) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (
      it.firma.toLowerCase().includes(s) ||
      it.title.toLowerCase().includes(s) ||
      it.note.toLowerCase().includes(s)
    );
  });

  const upcoming = filtered.filter((it) => it.date >= todayStr);
  const past = filtered.filter((it) => it.date < todayStr);

  return (
    <div className="teklif-page">
      <h1 className="teklif-title">Ajanda / Görüşme Hatırlatmaları</h1>
      <p className="teklif-info">
        Müşteri görüşmelerini ve takip aramalarını ajandaya ekleyin. Firma adı, tarih
        ve not girin; kayıtlı kalsın. Aşağıdaki arama kutusuyla firma veya notlara
        göre filtreleyebilirsiniz.
      </p>

      {/* Arama çubuğu */}
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Firma, başlık veya not içinde ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      <div className="teklif-form">
        <div className="field">
          <label>Firma Adı</label>
          <input
            type="text"
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
            placeholder="Örn: AC Lojistik AŞ"
          />
        </div>

        <div className="field">
          <label>Başlık</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Yakıt teklifi görüşmesi"
          />
        </div>

        <div className="field">
          <label>Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Saat</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label>Not (opsiyonel)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Örn: Mevcut tedarikçiyi dinle, sonra iskonto öner"
          />
        </div>
      </div>

      <button
        type="button"
        className="po-link"
        style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
        onClick={handleAdd}
      >
        Ajandaya Ekle
      </button>

      {/* Yaklaşan görüşmeler */}
      <div className="ajanda-section">
        <h2>Yaklaşan Görüşmeler</h2>
        {upcoming.length === 0 ? (
          <p className="offer-hint">Yaklaşan görüşme kaydı bulunmuyor.</p>
        ) : (
          <div className="ajanda-list">
            {upcoming.map((it) => (
              <div key={it.id} className="ajanda-item">
                <div className="ajanda-row">
                  <span className="ajanda-firma">{it.firma}</span>
                  <span className="ajanda-date">
                    {it.date} {it.time && `• ${it.time}`}
                  </span>
                </div>
                <div className="ajanda-row">
                  <span>{it.title}</span>
                </div>
                {it.note && <p className="ajanda-note">Not: {it.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Geçmiş görüşmeler */}
      {past.length > 0 && (
        <div className="ajanda-section">
          <h2>Geçmiş Görüşmeler</h2>
          <div className="ajanda-list">
            {past
              .slice()
              .reverse()
              .map((it) => (
                <div key={it.id} className="ajanda-item past">
                  <div className="ajanda-row">
                    <span className="ajanda-firma">{it.firma}</span>
                    <span className="ajanda-date">
                      {it.date} {it.time && `• ${it.time}`}
                    </span>
                  </div>
                  <div className="ajanda-row">
                    <span>{it.title}</span>
                  </div>
                  {it.note && <p className="ajanda-note">Not: {it.note}</p>}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
