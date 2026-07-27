'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar, Download } from 'lucide-react';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--neutral-500)' }}>
        Memuat data analitik...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--neutral-900)', marginBottom: '8px' }}>Laporan & Analitik</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Pantau performa penjualan, omset, dan pertumbuhan KopDes Anda.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--neutral-500)' }} />
            <select style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--neutral-300)', backgroundColor: 'white', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
              <option value="this_month">Bulan Ini (Juli 2026)</option>
              <option value="last_month">Bulan Lalu (Juni 2026)</option>
              <option value="this_year">Tahun Ini</option>
            </select>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            <span>Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '14px', fontWeight: '600', backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: '20px' }}>
              <TrendingUp size={14} /> +12.5%
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Total Pendapatan</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)' }}>Rp 48.500.000</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '14px', fontWeight: '600', backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: '20px' }}>
              <TrendingUp size={14} /> +8.2%
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Total Pesanan</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)' }}>342 <span style={{ fontSize: '14px', color: 'var(--neutral-400)', fontWeight: 'normal' }}>Transaksi</span></div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '14px', fontWeight: '600', backgroundColor: '#FEF2F2', padding: '4px 8px', borderRadius: '20px' }}>
              <TrendingDown size={14} /> -2.4%
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Pengeluaran (Restock)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)' }}>Rp 12.400.000</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '14px', fontWeight: '600', backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: '20px' }}>
              <TrendingUp size={14} /> +18.0%
            </div>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>Pelanggan Aktif (Warga)</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)' }}>128 <span style={{ fontSize: '14px', color: 'var(--neutral-400)', fontWeight: 'normal' }}>Orang</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Grafik Penjualan (Mockup) */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', color: 'var(--neutral-900)' }}>Tren Penjualan (Juli 2026)</h2>
          
          <div style={{ position: 'relative', height: '250px', borderLeft: '1px solid var(--neutral-200)', borderBottom: '1px solid var(--neutral-200)', paddingLeft: '8px', paddingBottom: '8px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
            {/* Bars */}
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <div key={i} style={{ flex: 1, height: `${height}%`, backgroundColor: 'var(--primary-200)', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'all 0.3s' }}>
                <div style={{ position: 'absolute', bottom: '100%', left: '0', right: '0', textAlign: 'center', fontSize: '10px', color: 'var(--primary-700)', fontWeight: '600', marginBottom: '4px' }}>{height}k</div>
                <div style={{ height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '8px', marginTop: '8px', color: 'var(--neutral-500)', fontSize: '12px' }}>
            <span>Minggu 1</span>
            <span>Minggu 2</span>
            <span>Minggu 3</span>
            <span>Minggu 4</span>
          </div>
        </div>

        {/* Top Selling Products */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--neutral-200)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--neutral-900)' }}>Produk Terlaris</h2>
            <button style={{ border: 'none', background: 'none', color: 'var(--primary-600)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Lihat Semua</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Beras Setra Ramos 5kg', sold: 145, revenue: 'Rp 9.425.000', icon: '🌾' },
              { name: 'Gula Pasir Gulaku 1kg', sold: 89, revenue: 'Rp 1.468.500', icon: '🧂' },
              { name: 'Minyak Goreng Bimoli 2L', sold: 76, revenue: 'Rp 2.584.000', icon: '🛢️' },
              { name: 'Telur Ayam Negeri 1kg', sold: 62, revenue: 'Rp 1.736.000', icon: '🥚' },
              { name: 'Indomie Kari Ayam', sold: 210, revenue: 'Rp 630.000', icon: '🍜' },
            ].map((prod, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--neutral-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {prod.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--neutral-900)' }}>{prod.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Terjual: {prod.sold} pcs</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#166534' }}>
                  {prod.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
