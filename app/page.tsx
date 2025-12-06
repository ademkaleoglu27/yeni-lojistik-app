import Link from "next/link";
import { Building2, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh] gap-8">
      
      {/* Başlık Alanı */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">Hoş Geldiniz</h1>
        <p className="mt-2 text-gray-600">Lojistik ve Saha Satış Yönetim Paneli</p>
      </div>

      {/* Butonlar Alanı */}
      <div className="flex flex-col sm:flex-row gap-6">
        
        {/* 1. Buton: Mevcut CRM Listesi */}
        <Link href="/firmalar" className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center gap-3 hover:border-blue-500 hover:shadow-xl transition cursor-pointer w-64">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Building2 size={40} />
          </div>
          <span className="font-semibold text-lg text-gray-800">Firmaları Yönet</span>
          <span className="text-xs text-gray-400">Mevcut listenizi düzenleyin</span>
        </Link>

        {/* 2. Buton: Yeni Google Arama Motoru */}
        <Link href="/firma-bul" className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center gap-3 hover:border-green-500 hover:shadow-xl transition cursor-pointer w-64">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <Globe size={40} />
          </div>
          <span className="font-semibold text-lg text-gray-800">İnternetten Firma Bul</span>
          <span className="text-xs text-gray-400">Google Haritalar'dan çek</span>
        </Link>

      </div>

    </div>
  );
}