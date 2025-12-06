'use client';

import { useState } from 'react';

function parseNumber(value: string): number {
  if (!value) return 0;
  const n = parseFloat(value.replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

function formatTL(n: number, digits: number = 2): string {
  if (!isFinite(n)) return '-';
  return n.toFixed(digits);
}

export default function KarlilikHesapPage() {
  const [basePrice, setBasePrice] = useState('54.40');      // pompa fiyatı
  const [volumeMonthly, setVolumeMonthly] = useState('15000'); // aylık litre
  const [discountTR, setDiscountTR] = useState('3');        // %
  const [discountStation, setDiscountStation] = useState('7'); // %

  const base = parseNumber(basePrice);
  const monthlyLiters = parseNumber(volumeMonthly);
  const dTR = parseNumber(discountTR);
  const dStation = parseNumber(discountStation);

  function calc(discountPercent: number) {
    if (base <= 0 || monthlyLiters <= 0 || discountPercent < 0) {
      return {
        newPrice: 0,
        savePerLitre: 0,
        monthlySave: 0,
        yearlySave: 0,
      };
    }

    const newPrice = base * (1 - discountPercent / 100);
    const savePerLitre = base - newPrice;
    const monthlySave = savePerLitre * monthlyLiters;
    const yearlySave = monthlySave * 12;

    return { newPrice, savePerLitre, monthlySave, yearlySave };
  }

  const sTR = calc(dTR);
  const sStation = calc(dStation);

  const formValid = base > 0 && monthlyLiters > 0;

  return (
    <div className="teklif-page">
      <h1 className="teklif-title">Karlılık / İskonto Hesabı</h1>
      <p className="teklif-info">
        Petrol Ofisi sitesinden güncel pompa fiyatını kontrol edin, buraya manuel
        girin. İskonto oranlarına göre müşterinizin aylık ve yıllık kazancını
        kartlarda gösterin.
      </p>

      <a
        href="https://www.petrolofisi.com.tr/akaryakit-fiyatlari"
        target="_blank"
        rel="noopener noreferrer"
        className="po-link"
      >
        Petrol Ofisi Güncel Fiyat Listesini Aç
      </a>

      {/* Form alanı */}
      <div className="teklif-form" style={{ marginTop: '0.8rem' }}>
        <div className="field">
          <label>Pompa Fiyatı (TL / Litre)</label>
          <input
            type="text"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Örn: 54.40"
          />
        </div>
        <div className="field">
          <label>Aylık Tahmini Tüketim (Litre)</label>
          <input
            type="number"
            value={volumeMonthly}
            onChange={(e) => setVolumeMonthly(e.target.value)}
            placeholder="Örn: 15000"
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

      {!formValid && (
        <p className="error" style={{ marginTop: '0.5rem' }}>
          Hesaplama için pompa fiyatı ve aylık litre alanlarını doldurun.
        </p>
      )}

      {/* SONUÇ KARTLARI – her durumda görünsün, ama değerler 0 olabilir */}
      <div className="teklif-grid" style={{ marginTop: '1rem' }}>
        {/* Türkiye Geneli */}
        <div className="teklif-card">
          <div className="pill-badge">Türkiye Geneli İskonto</div>
          <h2>%{formatTL(dTR, 2)} iskonto</h2>
          <p className="price-line">
            <span>Yeni fiyat:</span>
            <strong>{formatTL(sTR.newPrice, 3)} TL / L</strong>
          </p>
          <p className="price-line">
            <span>Litre başına kazanç:</span>
            <strong>{formatTL(sTR.savePerLitre, 3)} TL</strong>
          </p>
          <div className="gain-box">
            <p>
              <span>Aylık kazanç:</span>
              <strong>{formatTL(sTR.monthlySave)} TL</strong>
            </p>
            <p>
              <span>Yıllık kazanç:</span>
              <strong>{formatTL(sTR.yearlySave)} TL</strong>
            </p>
          </div>
        </div>

        {/* Anlaşmalı İstasyon */}
        <div className="teklif-card highlight">
          <div className="pill-badge pill-badge-accent">Anlaşmalı İstasyon</div>
          <h2>%{formatTL(dStation, 2)} iskonto</h2>
          <p className="price-line">
            <span>Yeni fiyat:</span>
            <strong>{formatTL(sStation.newPrice, 3)} TL / L</strong>
          </p>
          <p className="price-line">
            <span>Litre başına kazanç:</span>
            <strong>{formatTL(sStation.savePerLitre, 3)} TL</strong>
          </p>
          <div className="gain-box">
            <p>
              <span>Aylık kazanç:</span>
              <strong>{formatTL(sStation.monthlySave)} TL</strong>
            </p>
            <p>
              <span>Yıllık kazanç:</span>
              <strong>{formatTL(sStation.yearlySave)} TL</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
