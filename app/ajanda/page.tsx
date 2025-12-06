"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Trash2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AjandaSayfasi() {
  const [randevular, setRandevular] = useState<any[]>([]);
  const [yeniIs, setYeniIs] = useState({ baslik: "", tarih: "", saat: "", not: "" });
  const [eklemeModu, setEklemeModu] = useState(false);

  // Sayfa açılınca randevuları çek
  useEffect(() => {
    verileriGetir();
  }, []);

  async function verileriGetir() {
    // Tarihe göre sıralı getir (En yakın en üstte)
    const { data } = await supabase
      .from("ajanda")
      .select("*")
      .order("tarih", { ascending: true });
    
    if (data) setRandevular(data);
  }

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    
    // Tarih ve saati birleştirip kaydedelim (Sıralama için önemli)
    const tamTarih = `${yeniIs.tarih}T${yeniIs.saat}`;

    const { error } = await supabase.from("ajanda").insert([{
      baslik: yeniIs.baslik,
      tarih: tamTarih,
      not: yeniIs.not
    }]);

    if (!error) {
      alert("Randevu eklendi!");
      setEklemeModu(false);
      setYeniIs({ baslik: "", tarih: "", saat: "", not: "" });
      verileriGetir(); // Listeyi yenile
    } else {
      alert("Hata oluştu.");
    }
  }

  async function sil(id: number) {
    if (confirm("Bu randevuyu silmek istediğine emin misin?")) {
      await supabase.from("ajanda").delete().eq("id", id);
      verileriGetir();
    }
  }

  // Tarihi güzel formatta gösteren yardımcı fonksiyon
  const formatTarih = (tarihStr: string) => {
    const tarih = new Date(tarihStr);
    return tarih.toLocaleDateString("tr-TR", { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ajanda</h1>
          <p className="text-gray-500 text-sm">Planlı görüşmeleriniz</p>
        </div>
        <button 
          onClick={() => setEklemeModu(!eklemeModu)}
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* EKLEME FORMU (Açılır/Kapanır) */}
      {eklemeModu && (
        <div className="bg-white p-5 rounded-2xl shadow-md border border-blue-100 mb-6 animate-in slide-in-from-top-5">
          <h3 className="font-bold text-gray-800 mb-4">Yeni Randevu Oluştur</h3>
          <form onSubmit={kaydet} className="space-y-3">
            <input 
              type="text" placeholder="Görüşme Konusu / Firma" required
              className="w-full p-3 bg-gray-50 rounded-lg border focus:border-blue-500 outline-none"
              value={yeniIs.baslik} onChange={e => setYeniIs({...yeniIs, baslik: e.target.value})}
            />
            <div className="flex gap-2">
              <input 
                type="date" required
                className="w-full p-3 bg-gray-50 rounded-lg border focus:border-blue-500 outline-none"
                value={yeniIs.tarih} onChange={e => setYeniIs({...yeniIs, tarih: e.target.value})}
              />
              <input 
                type="time" required
                className="w-full p-3 bg-gray-50 rounded-lg border focus:border-blue-500 outline-none"
                value={yeniIs.saat} onChange={e => setYeniIs({...yeniIs, saat: e.target.value})}
              />
            </div>
            <textarea 
              placeholder="Notlar (Opsiyonel)"
              className="w-full p-3 bg-gray-50 rounded-lg border focus:border-blue-500 outline-none h-20"
              value={yeniIs.not} onChange={e => setYeniIs({...yeniIs, not: e.target.value})}
            />
            <button className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800">
              Kaydet
            </button>
          </form>
        </div>
      )}

      {/* RANDEVU LİSTESİ */}
      <div className="space-y-4">
        {randevular.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Calendar size={48} className="mx-auto mb-3 opacity-20" />
            <p>Planlanmış randevu yok.</p>
          </div>
        ) : (
          randevular.map((is) => (
            <div key={is.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
              {/* Sol Taraf: Saat Kutusu */}
              <div className="bg-blue-50 text-blue-700 rounded-xl p-3 flex flex-col items-center justify-center min-w-[70px]">
                <span className="text-lg font-bold">{is.tarih.split("T")[1]}</span>
                <Clock size={14} className="opacity-50 mt-1"/>
              </div>

              {/* Orta: İçerik */}
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  {formatTarih(is.tarih)}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{is.baslik}</h3>
                <p className="text-sm text-gray-500 mt-1">{is.not}</p>
              </div>

              {/* Sağ: Sil Butonu */}
              <button 
                onClick={() => sil(is.id)}
                className="text-gray-300 hover:text-red-500 self-start p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}