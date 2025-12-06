"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Save, MapPin, Globe, Phone, Loader2, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FirmaBulSayfasi() {
  const [sektor, setSektor] = useState("");
  const [sehir, setSehir] = useState("");
  const [sonuclar, setSonuclar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  // ARAMA YAPMA
  const ara = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);
    setSonuclar([]);

    try {
      const response = await fetch("/api/arama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sektor, sehir }),
      });
      
      const sonuc = await response.json();
      if (sonuc.success) {
        setSonuclar(sonuc.data);
      } else {
        alert("Hata: " + sonuc.error);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  // CRM'E KAYDETME (SUPABASE)
  const kaydet = async (firma: any) => {
    const yeniFirma = {
      ad: firma.ad,
      sehir: sehir, // Aradığımız şehri kaydedelim
      yetkili: "Otomatik (Google)",
      telefon: firma.telefon,
      notlar: [{
        id: Date.now(),
        tarih: new Date().toLocaleDateString("tr-TR"),
        metin: `Google'dan ${sektor} aramasıyla eklendi. Adres: ${firma.adres} - Puan: ${firma.puan}`
      }]
    };

    const { error } = await supabase.from("firmalar").insert([yeniFirma]);

    if (!error) {
      alert(firma.ad + " listene eklendi! ✅");
    } else {
      alert("Kaydedilemedi ❌");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-20">
      <Link href="/firmalar" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-blue-600">
        <ArrowLeft size={20} />
        <span>Ana Listeye Dön</span>
      </Link>

      {/* Arama Kutusu */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Globe className="text-blue-600" />
          Google'dan Firma Bul
        </h1>
        
        <form onSubmit={ara} className="grid gap-4 sm:grid-cols-3">
          <input 
            type="text" 
            placeholder="Şehir (Örn: Gaziantep)" 
            className="p-3 border rounded-lg outline-blue-500"
            value={sehir} onChange={(e) => setSehir(e.target.value)} required
          />
          <input 
            type="text" 
            placeholder="Sektör (Örn: Nakliyat)" 
            className="p-3 border rounded-lg outline-blue-500"
            value={sektor} onChange={(e) => setSektor(e.target.value)} required
          />
          <button disabled={yukleniyor} className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
            {yukleniyor ? <Loader2 className="animate-spin" /> : <Search />}
            {yukleniyor ? "Google Taranıyor..." : "Bul Getir"}
          </button>
        </form>
      </div>

      {/* SONUÇ LİSTESİ */}
      <div className="grid gap-4">
        {sonuclar.map((firma, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 transition hover:shadow-md">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{firma.ad}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14}/> {firma.adres}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={14}/> {firma.telefon}</p>
              
              <div className="flex gap-2 mt-2 items-center">
                 {firma.puan > 0 && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1"><Star size={10} fill="currentColor"/> {firma.puan}</span>}
                 {firma.web !== "Yok" && <a href={firma.web} target="_blank" className="text-blue-500 text-xs underline">Web Sitesi</a>}
              </div>
            </div>
            
            <button 
              onClick={() => kaydet(firma)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 h-fit self-center min-w-[140px]"
            >
              <Save size={18} />
              CRM'e Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}