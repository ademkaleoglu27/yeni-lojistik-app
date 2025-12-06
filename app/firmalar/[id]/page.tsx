"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MapPin, Phone, User, Building, Trash2, Search, MessageCircle, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FirmalarSayfasi() {
  const [firmalar, setFirmalar] = useState<any[]>([]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    verileriGetir();
  }, []);

  async function verileriGetir() {
    // Verileri ve yeni eklediğimiz sütunları (durum, sektor) çekiyoruz
    const { data, error } = await supabase
      .from("firmalar")
      .select("*")
      .order('id', { ascending: false });
    
    if (error) console.error(error);
    else setFirmalar(data || []);
    
    setYukleniyor(false);
  }

  const sil = async (id: number) => {
    if (confirm("Bu firmayı silmek istediğine emin misin?")) {
      const { error } = await supabase.from("firmalar").delete().eq("id", id);
      if (!error) {
        setFirmalar(firmalar.filter(f => f.id !== id));
      }
    }
  };

  // ARAMA FİLTRESİ
  const filtrelenmisFirmalar = firmalar.filter(firma => 
    firma.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    firma.sektor?.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    firma.sehir.toLowerCase().includes(aramaMetni.toLowerCase())
  );

  // DURUM RENKLERİ
  const durumRenkleri: any = {
    "Potansiyel": "bg-gray-100 text-gray-600",
    "Görüşülüyor": "bg-blue-50 text-blue-600",
    "Teklif Verildi": "bg-yellow-50 text-yellow-600",
    "Müşteri Oldu": "bg-green-50 text-green-600",
    "Olumsuz": "bg-red-50 text-red-600"
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      
      {/* ÜST BAŞLIK VE EKLE BUTONU */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Firma Listesi</h1>
          <p className="text-gray-500 text-sm">Toplam {firmalar.length} kayıt</p>
        </div>
        
        <Link href="/firmalar/yeni" className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          <Plus size={20} />
          <span className="hidden sm:inline">Yeni Ekle</span>
        </Link>
      </div>

      {/* ARAMA KUTUSU */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Firma adı, sektör veya şehir ara..." 
          className="w-full pl-10 p-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 outline-none shadow-sm"
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
        />
      </div>

      {/* LİSTELEME */}
      {yukleniyor ? (
        <div className="text-center py-10 text-gray-500">Listeler yükleniyor...</div>
      ) : filtrelenmisFirmalar.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Building size={48} className="mx-auto mb-3 opacity-20" />
          <p>Kayıt bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtrelenmisFirmalar.map((firma) => (
            <div key={firma.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* SOL: BİLGİLER */}
              <div className="flex items-start gap-4">
                {/* İkon Kutusu */}
                <div className="bg-gray-50 p-3 rounded-xl text-gray-600 mt-1 min-w-[50px] flex justify-center">
                  <Building size={24} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">{firma.ad}</h3>
                    {/* DURUM ETİKETİ */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${durumRenkleri[firma.durum] || "bg-gray-100 text-gray-500"}`}>
                      {firma.durum || "Potansiyel"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mt-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} />
                      <span>{firma.sektor || "Sektör Yok"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>{firma.yetkili}</span>
                      <span className="text-gray-300">|</span>
                      <MapPin size={14} />
                      <span>{firma.sehir}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAĞ: BUTONLAR */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* WhatsApp */}
                <a href={`https://wa.me/90${firma.telefon.replace(/\s/g, '').replace(/^0/, '')}`} target="_blank" className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 border border-green-200">
                  <MessageCircle size={20} />
                </a>
                
                {/* Arama */}
                <a href={`tel:${firma.telefon}`} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 border border-blue-200">
                  <Phone size={20} />
                </a>
                
                {/* Detay */}
                <Link 
                  href={`/firmalar/${firma.id}`}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 text-sm font-bold"
                >
                  Detay
                </Link>

                {/* Sil */}
                <button 
                  onClick={() => sil(firma.id)}
                  className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}