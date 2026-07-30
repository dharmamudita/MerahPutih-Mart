'use client';
import { useState, useEffect } from 'react';
import { Building2, Users, ShoppingCart, TrendingUp, Wallet, MapPin, Activity, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch dari API: /api/superadmin/dashboard
    // Karena kita baru menghubungkan backend, untuk UI testing kita bisa pasang mock jika API belum ready.
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/superadmin/dashboard');
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const chartData = [
    { name: 'Jan', omzet: 40000000, laba: 12000000 },
    { name: 'Feb', omzet: 45000000, laba: 14000000 },
    { name: 'Mar', omzet: 52000000, laba: 16000000 },
    { name: 'Apr', omzet: 48000000, laba: 14500000 },
    { name: 'Mei', omzet: 61000000, laba: 19000000 },
    { name: 'Jun', omzet: 75000000, laba: 23000000 },
  ];

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>Memuat Command Center...</div>;

  const kpi = stats?.kpi || {
    totalKopdesAktif: 0, totalPengguna: 0, totalPelanggan: 0, totalTransaksiBulanIni: 0, totalOmzetBulanan: 0, totalLaba: 0
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Dashboard Nasional</h1>
        <p style={{ color: 'var(--neutral-500)' }}>Ringkasan performa seluruh Koperasi Desa se-Indonesia.</p>
      </div>

      {/* KPI GRID */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={28} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '600', textTransform: 'uppercase' }}>Kopdes Aktif</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>{kpi.totalKopdesAktif}</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={12}/> +2 bulan ini</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={28} color="var(--info)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '600', textTransform: 'uppercase' }}>Total Pelanggan</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>{kpi.totalPelanggan}</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={12}/> +15% dari bulan lalu</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '600', textTransform: 'uppercase' }}>Omzet Nasional (Bulan Ini)</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)' }}>Rp {kpi.totalOmzetBulanan?.toLocaleString('id-ID')}</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600' }}>Dari {kpi.totalTransaksiBulanIni} Transaksi</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, var(--primary-900), var(--primary-800))', color: 'white', borderColor: 'transparent' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={28} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase' }}>Laba Kotor Nasional</div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>Rp {kpi.totalLaba?.toLocaleString('id-ID')}</div>
            <div style={{ fontSize: '12px', color: 'var(--primary-200)', fontWeight: '600' }}>Estimasi (30% Margin)</div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Trend Omzet */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary-600)" /> Tren Omzet & Laba (6 Bulan Terakhir)
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `Rp${val/1000000}M`} />
                <Tooltip cursor={{ fill: 'rgba(15, 118, 110, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="omzet" name="Total Omzet" fill="var(--primary-200)" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="laba" name="Laba Bersih" fill="var(--primary-600)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Kopdes */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--warning)" /> Top 5 Kopdes (Bulan Ini)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats?.topKopdes?.length > 0 ? stats.topKopdes.map((kopdes, index) => (
              <div key={kopdes.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: index === 0 ? 'var(--warning)' : 'var(--neutral-100)', color: index === 0 ? 'white' : 'var(--neutral-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                  #{index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--neutral-900)' }}>{kopdes.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} /> {kopdes.city}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-600)' }}>
                  Rp {(kopdes.omzet / 1000000).toFixed(1)}M
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--neutral-400)' }}>Belum ada data transaksi</div>
            )}
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '24px', background: 'white', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }}>Lihat Peringkat Lengkap</button>
        </div>

      </div>

    </div>
  );
}
