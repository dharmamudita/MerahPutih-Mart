'use client';
import { useState } from 'react';
import styles from './Laporan.module.css';
import { Download, FileText, Printer, BarChart2, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LaporanClient() {
  const [dateFrom, setDateFrom] = useState('2023-10-01');
  const [dateTo, setDateTo] = useState('2023-10-31');

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
            <span className={styles.statLabel}>Pendapatan Penjualan (POS)</span>
            <span className={styles.statValue}>Rp 24.500.000</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Pendapatan Penjualan (Online)</span>
            <span className={styles.statValue}>Rp 12.350.000</span>
          </div>
          <div className={styles.statRow} style={{ borderBottom: '2px solid var(--neutral-800)' }}>
            <span className={styles.statLabel} style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>Total Pendapatan Kotor</span>
            <span className={styles.statValue}>Rp 36.850.000</span>
          </div>

          <div className={styles.statRow} style={{ marginTop: '16px' }}>
            <span className={styles.statLabel}>Harga Pokok Penjualan (HPP)</span>
            <span className={styles.statValue} style={{ color: 'var(--danger)' }}>- Rp 22.100.000</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Biaya Operasional (Listrik, Pegawai)</span>
            <span className={styles.statValue} style={{ color: 'var(--danger)' }}>- Rp 3.400.000</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Diskon & Promo</span>
            <span className={styles.statValue} style={{ color: 'var(--danger)' }}>- Rp 500.000</span>
          </div>

          <div className={`${styles.statRow} ${styles.highlightRow}`}>
            <span className={styles.statLabel}>LABA BERSIH KOPERASI</span>
            <span className={styles.statValue}>Rp 10.850.000</span>
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
              <tr>
                <td className={styles.td} style={{ fontWeight: '800', color: 'var(--primary-600)' }}>#1</td>
                <td className={styles.td}>Beras Premium 5kg</td>
                <td className={styles.td}>145 Sak</td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '600' }}>Rp 9.425.000</td>
              </tr>
              <tr>
                <td className={styles.td} style={{ fontWeight: '800', color: 'var(--primary-500)' }}>#2</td>
                <td className={styles.td}>Gula Pasir 1kg</td>
                <td className={styles.td}>210 Pcs</td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '600' }}>Rp 3.150.000</td>
              </tr>
              <tr>
                <td className={styles.td} style={{ fontWeight: '800', color: 'var(--primary-400)' }}>#3</td>
                <td className={styles.td}>Minyak Goreng 2L</td>
                <td className={styles.td}>85 Pouch</td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '600' }}>Rp 2.550.000</td>
              </tr>
              <tr>
                <td className={styles.td} style={{ fontWeight: '700', color: 'var(--neutral-500)' }}>#4</td>
                <td className={styles.td}>Indomie Goreng</td>
                <td className={styles.td}>450 Pcs</td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '600' }}>Rp 1.350.000</td>
              </tr>
              <tr>
                <td className={styles.td} style={{ fontWeight: '700', color: 'var(--neutral-500)' }}>#5</td>
                <td className={styles.td}>Pupuk Urea 50kg</td>
                <td className={styles.td}>10 Sak</td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '600' }}>Rp 1.250.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
