import { Plus } from "lucide-react";

export default function FirmalarSayfasi() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Firma Listesi</h1>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
          <Plus size={20} />
          <span>Yeni Firma Ekle</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-12 text-center text-gray-500">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-50 p-4 rounded-full">
            <Plus size={40} className="text-blue-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Henüz firma yok</h3>
        <p className="mt-1">İlk firmanızı ekleyerek başlayın.</p>
      </div>
    </div>
  );
}