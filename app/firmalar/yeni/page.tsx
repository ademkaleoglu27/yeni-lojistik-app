import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function YeniFirmaSayfasi() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Geri Dön Butonu */}
      <Link href="/firmalar" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-blue-600">
        <ArrowLeft size={20} />
        <span>Listeye Dön</span>
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Firma Ekle</h1>

        {/* Form Başlangıcı */}
        <form className="space-y-4">
          
          {/* Firma Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
            <input type="text" placeholder="Örn: Aras Lojistik" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Şehir ve Yetkili (Yan Yana) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <input type="text" placeholder="Örn: İstanbul" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yetkili Kişi</label>
              <input type="text" placeholder="Ad Soyad" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input type="tel" placeholder="0532..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Kaydet Butonu */}
          <button type="button" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 mt-4">
            <Save size={20} />
            Kaydet
          </button>

        </form>
      </div>
    </div>
  );
}