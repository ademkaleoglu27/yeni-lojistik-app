"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function YeniFirmaSayfasi() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(false);

  const [formData, setFormData] = useState({
    ad: "",
    sehir: "",
    yetkili: "",
    telefon: "",
    sektor: "", // Yeni
    durum: "Potansiyel" // Yeni (Varsayılan)
  });

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);

    const yeniFirma = {
      ...formData,
      notlar: [{
        id: Date.now(),
        tarih: new Date().toLocaleDateString("tr-TR"),
        metin: "Firma sisteme eklendi."
      }]
    };

    const { error } = await supabase.from("firmalar").insert([yeniFirma]);

    if (error) {
      alert("Hata: " + error.message);
      setYukleniyor(false);
    } else {
      router.push("/firmalar");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <Link href="/firmalar" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-blue-600">
        <ArrowLeft size={20} />
        <span>Listeye Dön</span>
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Firma Ekle</h1>

        <form onSubmit={kaydet} className="space-y-4">
          
          {/* DURUM SEÇİMİ (YENİ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select 
              className="w-full p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 font-bold outline-none"
              value={formData.durum}
              onChange={(e) => setFormData({...formData, durum: e.target.value})}
            >
              <option value="Potansiyel">Potansiyel (Yeni)</option>
              <option value="Görüşülüyor">Görüşülüyor</option>
              <option value="Teklif Verildi">Teklif Verildi</option>
              <option value="Müşteri Oldu">✅ Müşteri Oldu</option>
              <option value="Olumsuz">❌ Olumsuz</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
            <input required type="text" placeholder="Örn: Aras Lojistik" className="w-full p-2 border rounded-lg outline-blue-500"
              value={formData.ad} onChange={(e) => setFormData({...formData, ad: e.target.value})} />
          </div>

          {/* SEKTÖR GİRİŞİ (YENİ) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
            <input type="text" placeholder="Örn: Nakliyat, Turizm, Gıda..." className="w-full p-2 border rounded-lg outline-blue-500"
              value={formData.sektor} onChange={(e) => setFormData({...formData, sektor: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <input required type="text" placeholder="Örn: İstanbul" className="w-full p-2 border rounded-lg outline-blue-500"
                value={formData.sehir} onChange={(e) => setFormData({...formData, sehir: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yetkili Kişi</label>
              <input type="text" placeholder="Ad Soyad" className="w-full p-2 border rounded-lg outline-blue-500"
                value={formData.yetkili} onChange={(e) => setFormData({...formData, yetkili: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input type="tel" placeholder="0532..." className="w-full p-2 border rounded-lg outline-blue-500"
              value={formData.telefon} onChange={(e) => setFormData({...formData, telefon: e.target.value})} />
          </div>

          <button type="submit" disabled={yukleniyor} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 mt-4 disabled:opacity-50">
            {yukleniyor ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}