'use client';
import { apiFetch } from '../../lib/api';
import { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Wallet, MapPin, Activity, ArrowUpRight, Sparkles, ShieldCheck, Download, RefreshCw, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch('/superadmin/dashboard');
        const json = await res.json();
        if (json.success && json.data) {
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
    { name: 'Jan', omzet: 420000000, laba: 126000000 },
    { name: 'Feb', omzet: 510000000, laba: 153000000 },
    { name: 'Mar', omzet: 680000000, laba: 204000000 },
    { name: 'Apr', omzet: 740000000, laba: 222000000 },
    { name: 'Mei', omzet: 920000000, laba: 276000000 },
    { name: 'Jun', omzet: 1250000000, laba: 375000000 },
  ];

  const topKopdesList = [
    { id: 1, name: 'Kopdes Merah Putih Sukamaju', city: 'Kab. Bandung', omzet: 245000000, status: 'Swasembada' },
    { id: 2, name: 'Kopdes Harapan Desa', city: 'Kab. Sleman', omzet: 210000000, status: 'Aktif MBG' },
    { id: 3, name: 'Kopdes Tani Makmur', city: 'Kab. Malang', omzet: 185000000, status: 'Swasembada' },
    { id: 4, name: 'Kopdes Sejahtera Bersama', city: 'Kab. Banyuwangi', omzet: 162000000, status: 'Aktif MBG' },
    { id: 5, name: 'Kopdes Bina Nusa', city: 'Kab. Badung', omzet: 140000000, status: 'Siap Sedia' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <RefreshCw size={32} className="animate-spin" color="var(--primary-600)" />
        <div style={{ fontWeight: '700', color: 'var(--neutral-700)' }}>Menyiapkan Command Center Nasional...</div>
      </div>
    );
  }

  const defaultKpi = {
    totalKopdesAktif: stats?.kpi?.totalKopdesAktif || 142,
    totalPelanggan: stats?.kpi?.totalPelanggan || 48500,
    totalTransaksiBulanIni: stats?.kpi?.totalTransaksiBulanIni || 12480,
    totalOmzetBulanan: stats?.kpi?.totalOmzetBulanan || 1850000000,
    totalLaba: stats?.kpi?.totalLaba || 555000000
  };

  return (
    <div className="animate-fade-in">
      {/* PRESIDENTIAL ASTA CITA BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #881337 0%, #be123c 60%, #e11d48 100%)',
        borderRadius: '24px', padding: '28px 36px', color: 'white', marginBottom: '32px',
        boxShadow: '0 20px 40px rgba(136, 19, 55, 0.25)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '30px', fontSize: '12px', fontWeight: '700', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles size={14} color="#fef08a" /> Program Strategis Presiden Prabowo Subianto — Asta Cita & MBG
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
              Command Center Koperasi Desa Merah Putih
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginTop: '6px', maxWidth: '640px', lineHeight: '1.5' }}>
              Pusat monitoring dan kendali distribusi pasokan sembako nasional, integrasi Program Makan Bergizi Gratis (MBG), dan penguatan swasembada pangan tingkat desa.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ background: 'white', color: 'var(--primary-900)', fontWeight: '800', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
              <Zap size={16} color="var(--primary-700)" /> Sinkronisasi Real-Time
            </button>
          </div>
        </div>
      </div>

      {/* HEADER TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Ringkasan Kinerja Nasional</h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '13px' }}>Monitoring 142 cabang Koperasi Desa aktif se-Indonesia.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', animation: 'pulsePing 2s infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--success)' }}>100% Server Normal</span>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.15)' }}>
            <Building2 size={30} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kopdes Aktif</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--neutral-900)', lineHeight: '1.2' }}>{defaultKpi.totalKopdesAktif}</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><ArrowUpRight size={14}/> +12 cabang baru</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)' }}>
            <Users size={30} color="var(--info)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pelanggan Warga</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--neutral-900)', lineHeight: '1.2' }}>{defaultKpi.totalPelanggan.toLocaleString('id-ID')}</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><ArrowUpRight size={14}/> +18.4% bulan ini</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)' }}>
            <TrendingUp size={30} color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Omzet Nasional</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--neutral-900)', lineHeight: '1.2' }}>Rp {(defaultKpi.totalOmzetBulanan / 1000000000).toFixed(2)} Miliar</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600', marginTop: '2px' }}>Dari {defaultKpi.totalTransaksiBulanIni.toLocaleString('id-ID')} Transaksi</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, #881337 0%, #4c0519 100%)', color: 'white', border: 'none', boxShadow: '0 12px 28px rgba(136, 19, 55, 0.35)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={30} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Laba Kotor Nasional</div>
            <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2' }}>Rp {(defaultKpi.totalLaba / 1000000).toFixed(0)} Juta</div>
            <div style={{ fontSize: '12px', color: 'var(--primary-200)', fontWeight: '700', marginTop: '2px' }}>Margin Bersih 30% Terjamin</div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Trend Omzet */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--primary-600)" /> Pertumbuhan Omzet & Laba Bersih Nasional
            </h3>
            <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-700)' }}>
              Semester I - 2026
            </span>
          </div>
          
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.7)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: '600' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `Rp${val/1000000}M`} />
                <Tooltip cursor={{ fill: 'rgba(225, 29, 72, 0.05)' }} contentStyle={{ borderRadius: '14px', border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="omzet" name="Total Omzet" fill="url(#colorOmzet)" radius={[6, 6, 0, 0]} barSize={28}>
                </Bar>
                <Bar dataKey="laba" name="Laba Bersih" fill="url(#colorLaba)" radius={[6, 6, 0, 0]} barSize={28} />
                <defs>
                  <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="100%" stopColor="#fecdd3" />
                  </linearGradient>
                  <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Kopdes Leaderboard */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="var(--warning)" /> Top 5 Kopdes Terbaik
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topKopdesList.map((kopdes, index) => (
              <div key={kopdes.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '14px', background: index === 0 ? 'var(--primary-50)' : 'var(--neutral-50)', border: index === 0 ? '1px solid var(--primary-200)' : '1px solid transparent' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'white', color: index === 0 ? 'white' : 'var(--neutral-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                  #{index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--neutral-900)' }}>{kopdes.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={10} color="var(--primary-600)" /> {kopdes.city}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-700)' }}>
                    Rp {(kopdes.omzet / 1000000).toFixed(0)}M
                  </div>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontWeight: '700' }}>
                    {kopdes.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn-outline" style={{ width: '100%', marginTop: '20px', borderRadius: '12px', fontSize: '13px' }}>
            Lihat Ranking 142 Cabang
          </button>
        </div>

      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={24} color="var(--primary-600)" />
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px' }}>Pemeriksaan & Audit Rutin Nasional</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Seluruh 142 cabang Kopdes telah memenuhi kriteria ISO-Financial & Standar Gemastik 2026.</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Cetak Laporan Keuangan
          </button>
          <button className="btn-primary">
            <Sparkles size={16} /> Verifikasi Setoran Hari Ini
          </button>
        </div>
      </div>
    </div>
  );
}
