'use client';
import { useState, useEffect } from 'react';
import styles from './Keuangan.module.css';
import { Download, Plus, Wallet, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function KeuanganClient() {
  const [filterType, setFilterType] = useState('ALL'); // ALL, IN, OUT
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  // Form states
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      const [transRes, sumRes] = await Promise.all([
        api.get(`/finance/cashflow?kopdesId=${DEV_KOPDES_ID}`),
        api.get(`/finance/summary?kopdesId=${DEV_KOPDES_ID}`)
      ]);
      
      if (transRes.data.success) {
        setTransactions(transRes.data.data);
      }
      if (sumRes.data.success) {
        setSummary(sumRes.data.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data keuangan');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = filterType === 'ALL' ? transactions : transactions.filter(t => (t.type === 'INCOME' || t.type === 'IN') ? filterType === 'IN' : filterType === 'OUT');

  const handleSavePengeluaran = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        type: 'OUT',
        category: formData.category,
        amount: formData.amount,
        description: formData.description,
        kopdesId: DEV_KOPDES_ID
      };

      const res = await api.post('/finance/cashflow', payload);
      if (res.data.success) {
        toast.success('Pengeluaran berhasil dicatat ke Buku Besar');
        setIsModalOpen(false);
        setFormData({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mencatat pengeluaran');
    } finally {
      setIsLoading(false);
    }
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
          <div className={styles.kpiValue}>Rp {summary.balance.toLocaleString('id-ID')}</div>
          <div className={`${styles.kpiTrend} ${styles.up}`}>
            <ArrowUpRight size={14} /> Total Saldo Aktif
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Pemasukan (Total)</div>
            <TrendingUp size={20} className={styles.kpiIcon} color="var(--success)" />
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--success)' }}>Rp {summary.totalIncome.toLocaleString('id-ID')}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Pengeluaran (Total)</div>
            <TrendingDown size={20} className={styles.kpiIcon} color="var(--danger)" />
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--danger)' }}>Rp {summary.totalExpense.toLocaleString('id-ID')}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiTitle}>Laba Kasar</div>
            <Wallet size={20} className={styles.kpiIcon} color="var(--primary-600)" />
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--primary-600)' }}>Rp {(summary.totalIncome - summary.totalExpense).toLocaleString('id-ID')}</div>
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
                  <div className={styles.dateText} style={{ fontSize: '13px', fontWeight: '600' }}>{new Date(t.createdAt).toLocaleString('id-ID')}</div>
                  <div className={styles.refText}>{t.id.substring(0, 10)}...</div>
                </td>
                <td className={styles.td}>
                  <div className={styles.descText}>{t.description}</div>
                </td>
                <td className={styles.td}>{t.category}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles['badge-' + ((t.type === 'IN' || t.type === 'INCOME') ? 'IN' : 'OUT')]}`}>
                    {(t.type === 'IN' || t.type === 'INCOME') ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                    {(t.type === 'IN' || t.type === 'INCOME') ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </td>
                <td className={styles.td} style={{ textAlign: 'right', fontWeight: '800', color: (t.type === 'IN' || t.type === 'INCOME') ? 'var(--success)' : 'var(--danger)' }}>
                  {(t.type === 'IN' || t.type === 'INCOME') ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
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
                  <select className={styles.select} required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Pilih Kategori...</option>
                    <option value="Operasional">Biaya Operasional (Listrik, Air, Internet)</option>
                    <option value="Gaji">Gaji Pegawai / Kasir</option>
                    <option value="Pembelian">Pembelian Stok Barang / Supplier</option>
                    <option value="Maintenance">Perbaikan / Maintenance</option>
                    <option value="Lainnya">Lain-lain</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nominal (Rp) *</label>
                  <input type="number" className={styles.input} required placeholder="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Keterangan *</label>
                  <textarea className={styles.textarea} required placeholder="Jelaskan untuk apa pengeluaran ini..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tanggal Transaksi</label>
                  <input type="date" className={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className={styles.btnPrimary} style={{ background: 'var(--danger)' }} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Pengeluaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
