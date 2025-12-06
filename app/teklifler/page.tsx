'use client';

import { useState } from 'react';

function toNumber(value: string): number {
  const n = parseFloat(value.replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

export default function TeklifPage() {
  const [basePrice, setBasePrice] = useState('50'); // TL / L
  const [volumeMonthly, setVolumeMonthly] = useState('10000'); // Litre
  const [discountTR, setDiscountTR] = useState('3'); // %
  const [discountStation, setDiscountStation] = useState('7'); // %

  const base = toNumber(basePrice);
  const monthlyLiters = toNumber(volumeMonthly);
  const dTR = toNumber(discountTR);
  const dStation = toNumber(discountStation);

  function calcScenario(discountPercent: number) {
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

  const sTR = calcScenario(dTR);
  const sStation = calcScenario(dStation);

  const formValid = base > 0 && monthlyLiters > 0;

  return (
    <div className="teklif-page">
      <h1 className="teklif-title">Karlılık / İskonto Hesabı</h1>
      <p className="teklif-info">
        Petrol Ofisi sitesinden güncel akaryakıt fiyatına bakın, pompa fiyatını TL/L
        olarak girin. İskonto oranlarını ve aylık tahmini tüketimi yazarak
        müşterinizin aylık / yıllık kazancını gösterin.
      </p>

      <a
        href="https://www.petrolofisi.com.tr/akaryakit-fiyatlari"
        target="_blank"
        rel="noopener noreferrer"
        className="po-link"
      >
        Petrol Ofisi Güncel Fiyat Listesini Aç
      </a>

      <div className="teklif-form">
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
        <p className="error">
          Hesaplama yapmak için pompa fiyatı ve aylık litre alanlarını doldurun.
        </p>
      )}

      {formValid && (
        <div className="teklif-grid">
          {/* Türkiye geneli */}
          <div className="teklif-card">
            <div className="pill-badge">Türkiye Geneli İskonto</div>
            <h2>%{dTR.toFixed(2)} iskonto</h2>
            <p className="price-line">
              <span>Yeni fiyat:</span>
              <strong>{sTR.newPrice.toFixed(3)} TL / L</strong>
            </p>
            <p className="price-line">
              <span>Litre başına kazanç:</span>
              <strong>{sTR.savePerLitre.toFixed(3)} TL</strong>
            </p>
            <div className="gain-box">
              <p>
                <span>Aylık kazanç:</span>
                <strong>{sTR.monthlySave.toFixed(2)} TL</strong>
              </p>
              <p>
                <span>Yıllık kazanç:</span>
                <strong>{sTR.yearlySave.toFixed(2)} TL</strong>
              </p>
            </div>
          </div>

          {/* Anlaşmalı istasyon */}
          <div className="teklif-card highlight">
            <div className="pill-badge pill-badge-accent">Anlaşmalı İstasyon</div>
            <h2>%{dStation.toFixed(2)} iskonto</h2>
            <p className="price-line">
              <span>Yeni fiyat:</span>
              <strong>{sStation.newPrice.toFixed(3)} TL / L</strong>
            </p>
            <p className="price-line">
              <span>Litre başına kazanç:</span>
              <strong>{sStation.savePerLitre.toFixed(3)} TL</strong>
            </p>
            <div className="gain-box">
              <p>
                <span>Aylık kazanç:</span>
                <strong>{sStation.monthlySave.toFixed(2)} TL</strong>
              </p>
              <p>
                <span>Yıllık kazanç:</span>
                <strong>{sStation.yearlySave.toFixed(2)} TL</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
