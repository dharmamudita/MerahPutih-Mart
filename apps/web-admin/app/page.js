'use client';
import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { TrendingUp, Package, Users, Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle, Box } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Sen', sales: 4000, revenue: 2400 },
  { name: 'Sel', sales: 3000, revenue: 1398 },
  { name: 'Rab', sales: 2000, revenue: 9800 },
  { name: 'Kam', sales: 2780, revenue: 3908 },
  { name: 'Jum', sales: 1890, revenue: 4800 },
  { name: 'Sab', sales: 2390, revenue: 3800 },
  { name: 'Min', sales: 3490, revenue: 4300 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSubtitle}>Ringkasan aktivitas dan performa Koperasi Desa hari ini.</p>
        </div>
        <div className={styles.dateBadge}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Pendapatan Hari Ini</div>
            <div className={`${styles.kpiIcon} ${styles.iconGreen}`}><Wallet size={20} /></div>
          </div>
          <div className={styles.kpiValue}>Rp 2.450.000</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendUp}><ArrowUpRight size={16} /> 12.5%</span> dari kemarin
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Total Penjualan</div>
            <div className={`${styles.kpiIcon} ${styles.iconBlue}`}><TrendingUp size={20} /></div>
          </div>
          <div className={styles.kpiValue}>142 Transaksi</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendUp}><ArrowUpRight size={16} /> 8.2%</span> dari kemarin
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Pelanggan Aktif</div>
            <div className={`${styles.kpiIcon} ${styles.iconPurple}`}><Users size={20} /></div>
          </div>
          <div className={styles.kpiValue}>85 Orang</div>
          <div className={styles.kpiTrend}>
            <span className={styles.trendDown}><ArrowDownRight size={16} /> 2.1%</span> dari kemarin
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Kas Saat Ini</div>
            <div className={`${styles.kpiIcon} ${styles.iconOrange}`}><Box size={20} /></div>
          </div>
          <div className={styles.kpiValue}>Rp 15.200.000</div>
          <div className={styles.kpiTrend}>
            Telah direkonsiliasi
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Chart Section */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Grafik Penjualan 7 Hari Terakhir</h2>
            <select className={styles.select}>
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#171717' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={3} dot={{r: 4, fill: '#DC2626', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Section */}
        <div className={styles.alertCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Peringatan Stok</h2>
            <div className={styles.badgeDanger}>Butuh Perhatian</div>
          </div>
          
          <div className={styles.alertList}>
            <div className={styles.alertItem}>
              <div className={styles.alertIcon}><AlertTriangle size={18} color="#DC2626" /></div>
              <div className={styles.alertContent}>
                <div className={styles.alertName}>Beras Premium 5kg</div>
                <div className={styles.alertStatus}>Sisa 2 karung (Kosong)</div>
              </div>
              <button className={styles.restockBtn}>Restock</button>
            </div>
            
            <div className={styles.alertItem}>
              <div className={styles.alertIcon}><AlertTriangle size={18} color="#F59E0B" /></div>
              <div className={styles.alertContent}>
                <div className={styles.alertName}>Minyak Goreng Bimoli 2L</div>
                <div className={styles.alertStatus}>Sisa 15 pouch (Hampir Habis)</div>
              </div>
              <button className={styles.restockBtn}>Restock</button>
            </div>

            <div className={styles.alertItem}>
              <div className={styles.alertIcon}><AlertTriangle size={18} color="#F59E0B" /></div>
              <div className={styles.alertContent}>
                <div className={styles.alertName}>Gula Pasir Gulaku 1kg</div>
                <div className={styles.alertStatus}>Sisa 20 pcs (Hampir Habis)</div>
              </div>
              <button className={styles.restockBtn}>Restock</button>
            </div>
            
            <div className={styles.alertItem}>
              <div className={styles.alertIcon}><AlertTriangle size={18} color="#F59E0B" /></div>
              <div className={styles.alertContent}>
                <div className={styles.alertName}>Indomie Goreng Special</div>
                <div className={styles.alertStatus}>Sisa 40 pcs (Hampir Habis)</div>
              </div>
              <button className={styles.restockBtn}>Restock</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
