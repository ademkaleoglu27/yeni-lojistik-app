"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
// Supabase bağlantısını çağırıyoruz
import { supabase } from "@/lib/supabase";

export default function YeniFirmaSayfasi() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(false);

  const [formData, setFormData] = useState({
    ad: "",
    sehir: "",
    yetkili: "",
    telefon: "",
  });

  // KAYDETME FONKSİYONU (ARTIK BULUTA GÖNDERİYOR)
  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true); // Butonu pasif yap (çift tıklamayı önle)

    // 1. Veriyi hazırla
    const yeniFirma = {
      ad: formData.ad,
      sehir: formData.sehir,
      yetkili: formData.yetkili,
      telefon: formData.telefon,
      notlar: [] // İlk başta boş not listesi
    };

    // 2. Supabase'e gönder
    const { error } = await supabase
      .from("firmalar")
      .insert([yeniFirma]);

    if (error) {
      alert("Hata oluştu: " + error.message);
      setYukleniyor(false);
    } else {
      alert("Firma buluta kaydedildi!");
      router.push("/firmalar"); // Listeye geri dön
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link href="/firmalar" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-blue-600">
        <ArrowLeft size={20} />
        <span>Listeye Dön</span>
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Firma Ekle</h1>

        <form onSubmit={kaydet} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
            <input 
              required
              type="text" 
              placeholder="Örn: Aras Lojistik" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.ad}
              onChange={(e) => setFormData({...formData, ad: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <input 
                required
                type="text" 
                placeholder="Örn: İstanbul" 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.sehir}
                onChange={(e) => setFormData({...formData, sehir: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yetkili Kişi</label>
              <input 
                type="text" 
                placeholder="Ad Soyad" 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.yetkili}
                onChange={(e) => setFormData({...formData, yetkili: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input 
              type="tel" 
              placeholder="0532..." 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.telefon}
              onChange={(e) => setFormData({...formData, telefon: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={yukleniyor}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
          >
            {yukleniyor ? "Kaydediliyor..." : (
              <>
                <Save size={20} />
                Kaydet
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}