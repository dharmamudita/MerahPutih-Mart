'use client';
import { useState } from 'react';
import styles from './Keuangan.module.css';
import { Download, Plus, Wallet, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KeuanganClient() {
  const [filterType, setFilterType] = useState('ALL'); // ALL, IN, OUT
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactions] = useState([
    { id: 'TRX-231024-01', date: '24 Okt 2023, 15:30', description: 'Pendapatan Penjualan POS (Shift Siang)', type: 'IN', amount: 1250000, category: 'Penjualan' },
    { id: 'TRX-231024-02', date: '24 Okt 2023, 11:00', description: 'Pendapatan E-commerce (INV-001)', type: 'IN', amount: 175000, category: 'Penjualan' },
    { id: 'TRX-231023-03', date: '23 Okt 2023, 09:00', description: 'Pembayaran Tagihan Listrik Koperasi', type: 'OUT', amount: 450000, category: 'Operasional' },
    { id: 'TRX-231022-04', date: '22 Okt 2023, 14:00', description: 'Pembelian Stok Barang (PT Bumi Pangan)', type: 'OUT', amount: 2500000, category: 'Pembelian' },
    { id: 'TRX-231021-05', date: '21 Okt 2023, 08:30', description: 'Pendapatan Penjualan POS (Shift Pagi)', type: 'IN', amount: 850000, category: 'Penjualan' },
  ]);

  const filteredTransactions = filterType === 'ALL' ? transactions : transactions.filter(t => t.type === filterType);

  const handleSavePengeluaran = (e) => {
    e.preventDefault();
    toast.success('Pengeluaran berhasil dicatat ke Buku Besar');
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Keuangan & Arus Kas</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginTop: '4px' }}>Pantau seluruh arus kas masuk dan keluar koperasi</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary}>
            <Download size={18} /> Export Laporan Arus Kas
          </button>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)} style={{ background: 'var(--danger)' }}>
            <Plus size={18} /> Catat Pengeluaran
          </button>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.dark}`}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Saldo Kas Utama</div>
            <Wallet size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>Rp 15.450.000</div>
          <div className={`${styles.kpiTrend} ${styles.up}`}>
            <ArrowUpRight size={14} /> +Rp 2.500.000 bulan ini
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Pemasukan (Bulan Ini)</div>
            <TrendingUp size={20} className={styles.kpiIcon} color="var(--success)" />
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--success)' }}>Rp 8.250.000</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Pengeluaran (Bulan Ini)</div>
            <TrendingDown size={20} className={styles.kpiIcon} color="var(--danger)" />
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--danger)' }}>Rp 3.100.000</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Laba Kasar</div>
            <Wallet size={20} className={styles.kpiIcon} color="var(--primary-600)" />
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--primary-600)' }}>Rp 5.150.000</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Buku Besar (Riwayat Transaksi)</h2>
          <div className={styles.filterRow}>
            <select 
              className={styles.filterSelect}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">Semua Transaksi</option>
              <option value="IN">Hanya Pemasukan (+)</option>
              <option value="OUT">Hanya Pengeluaran (-)</option>
            </select>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Waktu & Referensi</th>
              <th className={styles.th}>Keterangan</th>
              <th className={styles.th}>Kategori</th>
              <th className={styles.th}>Tipe</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Nominal</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.dateText} style={{ fontSize: '13px', fontWeight: '600' }}>{t.date}</div>
                  <div className={styles.refText}>{t.id}</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.descText}>{t.description}</div>
                </td>
                <td className={styles.td}>{t.category}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles['badge-' + t.type]}`}>
                    {t.type === 'IN' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                    {t.type === 'IN' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '800', color: t.type === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                  {t.type === 'IN' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Catat Pengeluaran Baru</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSavePengeluaran}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kategori Pengeluaran *</label>
                  <select className={styles.select} required>
                    <option value="">Pilih Kategori...</option>
                    <option value="operasional">Biaya Operasional (Listrik, Air, Internet)</option>
                    <option value="gaji">Gaji Pegawai / Kasir</option>
                    <option value="maintenance">Perbaikan / Maintenance</option>
                    <option value="lainnya">Lain-lain</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nominal (Rp) *</label>
                  <input type="number" className={styles.input} required placeholder="0" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Keterangan *</label>
                  <textarea className={styles.textarea} required placeholder="Jelaskan untuk apa pengeluaran ini..."></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tanggal Transaksi</label>
                  <input type="date" className={styles.input} defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className={styles.btnPrimary} style={{ background: 'var(--danger)' }}>Simpan Pengeluaran</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
