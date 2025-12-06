'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type AjandaItem = {
  id: string;
  firma: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  note: string;
};

const links = [
  { href: '/', label: 'Giriş' },
  { href: '/dashboard', label: 'CRM' },
  { href: '/firma-bul', label: 'İnternetten Müşteri Bul' },
  { href: '/teklif', label: 'Karlılık Hesabı' },
  { href: '/teklif-hazirla', label: 'Teklif Hazırla' },
  { href: '/teklif-kayit', label: 'Teklif Kayıt' },
  { href: '/ajanda', label: 'Ajanda' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hasUpcoming, setHasUpcoming] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('ajanda-items-v1');
      if (!raw) {
        setHasUpcoming(false);
        return;
      }
      const items = JSON.parse(raw) as AjandaItem[];
      const todayStr = new Date().toISOString().slice(0, 10);
      const upcoming = items.some((it) => it.date >= todayStr);
      setHasUpcoming(upcoming);
    } catch {
      setHasUpcoming(false);
    }
  }, [pathname]);

  return (
    <>
      {/* Üst bar (desktop) */}
      <nav className="navbar desktop-nav">
        <div className="nav-container">
          <div className="nav-left">
            <span className="nav-logo">LojistikCRM</span>
          </div>
          <div className="nav-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  'nav-link ' + (pathname === link.href ? 'active' : '')
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="nav-right">
            <Link href="/ajanda" className="notify-wrap">
              <button className="notify-btn" type="button">
                🔔
                {hasUpcoming && <span className="notify-dot" />}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Alt bar (mobil) */}
      <nav className="bottom-nav mobile-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              'bottom-nav-item ' + (pathname === link.href ? 'active' : '')
            }
          >
            <span className="bottom-nav-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
