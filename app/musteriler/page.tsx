const customers = [
  { id: 1, name: 'AC Lojistik', city: 'İstanbul', status: 'Aktif', lastOrder: '12.11.2025' },
  { id: 2, name: 'Mavi Deniz Nakliyat', city: 'İzmir', status: 'Aktif', lastOrder: '02.11.2025' },
  { id: 3, name: 'Hızlı Kargo AŞ', city: 'Ankara', status: 'Pasif', lastOrder: '18.09.2025' },
];

export default function MusterilerPage() {
  return (
    <div className="bg-surface rounded-md shadow-sm p-4">
      <h1 className="text-xl font-semibold text-text-primary mb-4">Müşteriler</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-text-secondary border-b">
            <tr>
              <th className="py-2 pr-4">Müşteri Adı</th>
              <th className="py-2 pr-4">Şehir</th>
              <th className="py-2 pr-4">Durum</th>
              <th className="py-2 pr-4">Son Sipariş</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-2 pr-4">{c.name}</td>
                <td className="py-2 pr-4">{c.city}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      'px-2 py-1 rounded-full text-xs ' +
                      (c.status === 'Aktif'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600')
                    }
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-2 pr-4">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
