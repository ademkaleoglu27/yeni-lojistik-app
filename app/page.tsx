import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home">
      <div className="home-inner">
        <h1 className="home-title">Hoş Geldiniz</h1>
        <p className="home-subtitle">
          Lojistik ve Saha Satış Yönetim Paneli
        </p>

        <div className="home-actions">
          {/* Firmaları Yönet kartı */}
          <Link href="/firmalar" className="home-card">
            <div>
              <h2>Firmaları Yönet</h2>
              <p>
                Mevcut firma listenizi yönetin, CRM tarafında müşteri bilgilerini ve
                görüşme notlarını tutun, teklif ve fiyatları takip edin.
              </p>
            </div>
            <span className="home-card-cta">CRM’e git →</span>
          </Link>

          {/* İnternetten Firma Bul kartı */}
          <Link href="/firma-bul" className="home-card">
            <div>
              <h2>İnternetten Firma Bul</h2>
              <p>
                Google üzerinden lojistik, turizm vb. firmaları arayın, iletişim
                bilgilerini görün ve seçtiklerinizi tek tıkla CRM listenize ekleyin.
              </p>
            </div>
            <span className="home-card-cta">Firma bulmaya başla →</span>
          </Link>
        </div>

        {/* Alt menü – mevcut linklerin daha derli toplu hali */}
        <nav className="home-nav">
          <Link href="/pano">Pano</Link>
          <Link href="/firma-bul">Firma Bul</Link>
          <Link href="/firmalar">Müşteriler</Link>
          <Link href="/teklif">Teklif/Hesap</Link>
          <Link href="/ajanda">Ajanda</Link>
        </nav>
      </div>
    </main>
  );
}
