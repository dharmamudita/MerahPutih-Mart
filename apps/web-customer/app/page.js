import Link from 'next/link';

export default function Home() {
  const products = [
    { id: 1, name: 'Beras Setra Ramos 5kg', price: 65000, category: 'Sembako', image: '🌾' },
    { id: 2, name: 'Minyak Goreng Bimoli 2L', price: 34000, category: 'Sembako', image: '🛢️' },
    { id: 3, name: 'Gula Pasir Gulaku 1kg', price: 16500, category: 'Sembako', image: '🧂' },
    { id: 4, name: 'Indomie Kari Ayam', price: 3000, category: 'Snack & Minuman', image: '🍜' },
    { id: 5, name: 'Telur Ayam Negeri 1kg', price: 28000, category: 'Sembako', image: '🥚' },
  ];

  return (
    <div>
      {/* Hero Banner Section */}
      <section style={{ backgroundColor: 'var(--primary-600)', color: 'var(--white)', padding: '60px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.2 }}>
              Belanja Kebutuhan Harian, <br/>Harga Spesial Warga Desa.
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px' }}>
              Beli sembako dan kebutuhan pertanian langsung dari Koperasi Desa Merah Putih. Dijamin murah, segar, dan bermanfaat untuk kemajuan desa kita.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/belanja" className="btn" style={{ backgroundColor: 'var(--gold)', color: 'var(--neutral-900)' }}>
                Belanja Sekarang
              </Link>
              <Link href="/promo" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'var(--white)' }}>
                Lihat Promo
              </Link>
            </div>
          </div>
          {/* Hero Image Placeholder */}
          <div style={{ width: '400px', height: '300px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '64px' }}>🛒</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ padding: '60px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Produk Pilihan Hari Ini</h2>
          <Link href="/belanja" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Lihat Semua &rarr;</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          {products.map(product => (
            <div key={product.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: '160px', backgroundColor: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                {product.image}
              </div>
              <div style={{ padding: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--primary-600)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>{product.category}</span>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--neutral-900)' }}>{product.name}</h3>
                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--danger)' }}>Rp {product.price.toLocaleString('id-ID')}</p>
                <button className="btn btn-outline" style={{ width: '100%', marginTop: '16px' }}>
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section style={{ backgroundColor: 'var(--primary-50)', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }}>Mengapa Belanja di MerahPutih Mart?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>💰</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Harga Lebih Murah</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>Barang disuplai langsung dari distributor pusat untuk memastikan harga terjangkau.</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🛵</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Gratis Ongkos Kirim</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>Pengiriman langsung dari KopDes terdekat ke rumah Anda tanpa biaya tambahan.</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🤝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Mendukung Ekonomi Desa</h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>Keuntungan koperasi akan dikembalikan untuk program pembangunan desa.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
