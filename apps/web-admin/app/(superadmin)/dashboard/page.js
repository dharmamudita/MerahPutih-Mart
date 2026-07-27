import { Users, Store, Activity, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Dashboard Super Admin | KopDes Management',
};

export default function SuperAdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Dashboard Pusat</h1>
      <p style={{ color: 'var(--neutral-500)', marginBottom: '24px' }}>Ringkasan performa seluruh Koperasi Desa Merah Putih</p>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--primary-50)', borderRadius: '12px', color: 'var(--primary-600)' }}>
            <Store size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Total KopDes</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>124</h3>
            <span style={{ fontSize: '12px', color: 'var(--success)' }}>+3 bulan ini</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--info-bg)', borderRadius: '12px', color: 'var(--info)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Total Pelanggan</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>15,240</h3>
            <span style={{ fontSize: '12px', color: 'var(--success)' }}>+120 hari ini</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--warning-bg)', borderRadius: '12px', color: 'var(--warning)' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Transaksi Hari Ini</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>8,432</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--success-bg)', borderRadius: '12px', color: 'var(--success)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '4px' }}>Omzet Harian</p>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>Rp 1.2M</h3>
          </div>
        </div>

      </div>

      {/* Chart Section Placeholder */}
      <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--white)' }}>
        <div style={{ textAlign: 'center', color: 'var(--neutral-400)' }}>
          <Activity size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Grafik Penjualan Nasional (Akan diimplementasi menggunakan Recharts)</p>
        </div>
      </div>
    </div>
  );
}
