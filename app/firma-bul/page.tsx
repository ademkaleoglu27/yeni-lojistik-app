'use client';

import { useState } from 'react';

type SearchResult = {
  id: string;
  name: string;
  address: string;
  city: string;
  segment: string;
  phone: string;
  website?: string;
};

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

const FIRMS_KEY = 'firms-v1';

export default function FirmaBulPage() {
  const [city, setCity] = useState('');
  const [segment, setSegment] = useState<'Hepsi' | 'Lojistik' | 'Turizm'>(
    'Hepsi'
  );
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setAddedId(null);

    try {
      const params = new URLSearchParams();
      if (city.trim()) params.set('city', city.trim());
      if (segment !== 'Hepsi') params.set('segment', segment);
      if (keyword.trim()) params.set('keyword', keyword.trim());

      const res = await fetch('/api/google-places?' + params.toString());
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Arama sırasında bir hata oluştu.');
        return;
      }

      setResults(data.results || []);
    } catch (e) {
      console.error(e);
      setError('Sunucuya bağlanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCRM = (item: SearchResult) => {
    try {
      const raw = localStorage.getItem(FIRMS_KEY);
      const list = raw ? (JSON.parse(raw) as Firm[]) : [];

      const newFirm: Firm = {
        id: crypto.randomUUID(),
        name: item.name,
        contact: '',
        phone: item.phone || '',
        city: item.city || city || '',
        segment:
          item.segment && item.segment.length > 0
            ? item.segment
            : segment === 'Hepsi'
            ? ''
            : segment,
        note: item.address || '',
        createdAt: new Date().toISOString(),
      };

      list.unshift(newFirm);
      localStorage.setItem(FIRMS_KEY, JSON.stringify(list));
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="teklif-page">
      <h1 className="teklif-title">İnternetten Müşteri Bul</h1>
      <p className="teklif-info">
        Google üzerinden lojistik / turizm firmalarını şehir ve anahtar kelimeye göre
        arayın. Bulduğunuz firmaları tek tıkla CRM müşteri listenize ekleyin.
      </p>

      {/* Filtreler */}
      <div className="teklif-form">
        <div className="field">
          <label>Şehir</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Örn: İstanbul, İzmir..."
          />
        </div>

        <div className="field">
          <label>Sektör</label>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value as any)}
          >
          <option value="Hepsi">Hepsi</option>
            <option value="Lojistik">Lojistik</option>
            <option value="Turizm">Turizm</option>
          </select>
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label>Anahtar Kelime</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Örn: filolu, tanker, otobüs, tur..."
          />
        </div>
      </div>

      <button
        type="button"
        className="po-link"
        style={{ marginTop: '0.5rem', marginBottom: '0.8rem' }}
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Aranıyor...' : 'Müşteri Bul'}
      </button>

      {error && (
        <p className="error" style={{ marginBottom: '0.6rem' }}>
          {error}
        </p>
      )}

      {/* Sonuçlar */}
      <div className="firm-list">
        {loading && (
          <p className="offer-hint">Google üzerinde arama yapılıyor...</p>
        )}

        {!loading && results.length === 0 && !error && (
          <p className="offer-hint">
            Henüz sonuç yok. Bir şehir ve (isteğe bağlı) sektör / anahtar kelime
            girerek &quot;Müşteri Bul&quot; butonuna basın.
          </p>
        )}

        {results.map((f) => (
          <div key={f.id} className="firm-card">
            <div className="firm-row">
              <span className="firm-name">{f.name}</span>
              <span className="firm-meta">
                {(f.city || city || '') +
                  (f.segment ? ` • ${f.segment}` : '')}
              </span>
            </div>

            <div className="firm-row">
              <span>{f.address}</span>
            </div>

            {f.phone && (
              <div className="firm-row">
                <span>{f.phone}</span>
              </div>
            )}

            {f.website && (
              <div className="firm-row">
                <a
                  href={f.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.78rem' }}
                >
                  Web Sitesi Aç
                </a>
              </div>
            )}

            <button
              type="button"
              className="po-link"
              style={{
                marginTop: '0.4rem',
                padding: '0.3rem 0.8rem',
                fontSize: '0.78rem',
              }}
              onClick={() => handleAddToCRM(f)}
            >
              {addedId === f.id ? 'CRM’e Eklendi ✓' : 'CRM’e Ekle'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
