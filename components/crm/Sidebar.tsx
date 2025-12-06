import Link from 'next/link';

const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Siparişler', href: '/dashboard/orders' },
  { label: 'Ürünler', href: '/dashboard/products' },
  { label: 'Müşteriler', href: '/dashboard/customers' },
  { label: 'Kampanyalar', href: '/dashboard/campaigns' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-60 bg-surface border-r border-border min-h-screen p-4">
      <div className="mb-6 font-bold text-lg text-primary">Lojistik Paneli</div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-primary/5 hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
