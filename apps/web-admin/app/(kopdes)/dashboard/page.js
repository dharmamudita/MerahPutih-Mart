import { ShoppingCart, Package, AlertTriangle, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Dashboard Admin Kopdes | KopDes Management',
};

export default function KopdesDashboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Dashboard KopDes</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Ringkasan performa Koperasi Desa Anda hari ini</p>
        </div>
        <div style={{ padding: '8px 16px', backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
          Shift Aktif: Siti Kasir (08:00 - 16:00)
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--success-bg)', borderRadius: '12px', color: 'var(--success)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Penjualan Hari Ini</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Rp 4.500.000</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--primary-50)', borderRadius: '12px', color: 'var(--primary-600)' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Total Transaksi</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>142</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--info-bg)', borderRadius: '12px', color: 'var(--info)' }}>
            <Package size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Pesanan Online Baru</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>12</h3>
            <span style={{ fontSize: '12px', color: 'var(--warning)' }}>Menunggu diproses</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--danger-bg)', borderRadius: '12px', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Stok Menipis / Habis</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>5</h3>
            <span style={{ fontSize: '12px', color: 'var(--danger)' }}>Perlu segera restock</span>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card" style={{ height: '400px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Grafik Penjualan 7 Hari Terakhir</h3>
          <div style={{ height: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-400)' }}>
            (Chart Placeholder)
          </div>
        </div>

        <div className="card" style={{ height: '400px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Produk Terlaris Hari Ini</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Product Placeholder */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--neutral-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--neutral-100)', borderRadius: '8px' }}></div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>Indomie Goreng Special</p>
                    <p style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Rp 3.500</p>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-600)' }}>
                  4{i} pcs
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
