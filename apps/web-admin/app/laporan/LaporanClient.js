'use client';
import { useState, useEffect } from 'react';
import styles from './Laporan.module.css';
import { Download, FileText, Printer, BarChart2, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function LaporanClient() {
  const [dateFrom, setDateFrom] = useState('2023-10-01');
  const [dateTo, setDateTo] = useState('2023-10-31');
  const [stats, setStats] = useState({ totalRevenue: 0, totalSalesCount: 0, topProducts: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/reports/dashboard?kopdesId=${DEV_KOPDES_ID}`);
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        toast.error('Gagal memuat laporan');
      }
    };
    fetchStats();
  }, []);

  const handleExportPDF = () => {
    toast.success('Mengunduh Laporan Laba Rugi (PDF)...');
  };

  const handleExportExcel = () => {
    toast.success('Mengunduh Laporan Detail (Excel)...');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Laporan & Analitik</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginTop: '4px' }}>Ringkasan performa penjualan dan laba rugi koperasi</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={handleExportExcel}>
            <Download size={18} /> Export Excel
          </button>
          <button className={styles.btnPrimary} onClick={handleExportPDF}>
            <FileText size={18} /> Cetak Laba Rugi (PDF)
          </button>
        </div>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Dari Tanggal</label>
          <input type="date" className={styles.input} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Sampai Tanggal</label>
          <input type="date" className={styles.input} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button className={styles.btnSecondary} style={{ height: '42px' }}>
          Terapkan Filter
        </button>
      </div>

      <div className={styles.reportGrid}>
        {/* Laba Rugi */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Laporan Laba Rugi Sederhana</div>
            <FileText size={20} color="var(--neutral-400)" />
          </div>
          
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total Transaksi Sukses</span>
            <span className={styles.statValue}>{stats.totalSalesCount} Transaksi</span>
          </div>
          <div className={styles.statRow} style={{ borderBottom: '2px solid var(--neutral-800)' }}>
            <span className={styles.statLabel} style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>Total Pendapatan Kotor</span>
            <span className={styles.statValue}>Rp {stats.totalRevenue.toLocaleString('id-ID')}</span>
          </div>

          <div className={styles.statRow} style={{ marginTop: '16px' }}>
            <span className={styles.statLabel}>Harga Pokok Penjualan (HPP) (Estimasi)</span>
            <span className={styles.statValue} style={{ color: 'var(--danger)' }}>- Rp {(stats.totalRevenue * 0.7).toLocaleString('id-ID')}</span>
          </div>
          
          <div className={`${styles.statRow} ${styles.highlightRow}`}>
            <span className={styles.statLabel}>LABA BERSIH ESTIMASI (30%)</span>
            <span className={styles.statValue}>Rp {(stats.totalRevenue * 0.3).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Top Produk */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Produk Terlaris (Top 5)</div>
            <BarChart2 size={20} color="var(--neutral-400)" />
          </div>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Peringkat</th>
                <th className={styles.th}>Nama Produk</th>
                <th className={styles.th}>Terjual</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Omzet</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, i) => (
                <tr key={i}>
                  <td className={styles.td} style={{ fontWeight: '800', color: i === 0 ? 'var(--primary-600)' : (i === 1 ? 'var(--primary-500)' : 'var(--neutral-500)') }}>#{i+1}</td>
                  <td className={styles.td}>{p.name}</td>
                  <td className={styles.td}>{p.qty} Pcs</td>
                  <td className={styles.td} style={{ textAlign: 'right', fontWeight: '600' }}>Rp {p.revenue.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {stats.topProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.td} style={{ textAlign: 'center' }}>Belum ada data penjualan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
