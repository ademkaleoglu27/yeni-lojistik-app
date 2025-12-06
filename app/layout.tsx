import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Lojistik Paneli',
  description: 'E-ticaret + CRM paneli',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-background text-text-primary">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
