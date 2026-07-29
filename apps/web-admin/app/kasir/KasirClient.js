'use client';
import { useState, useEffect } from 'react';
import styles from './Kasir.module.css';
import { Plus, Clock, Store, X, KeySquare, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function KasirClient() {
  const router = useRouter();
  const [kasirs, setKasirs] = useState([]);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  
  // Modals
  const [modalBukaKas, setModalBukaKas] = useState(false);
  const [modalTutupKas, setModalTutupKas] = useState(false);
  const [kasAwal, setKasAwal] = useState('');
  const [kasAkhirFisik, setKasAkhirFisik] = useState('');

  // Mock Data
  useEffect(() => {
    setKasirs([
      { id: 1, name: 'Budi Santoso', email: 'budi@kopdes.id', role: 'Kasir Utama', lastLogin: 'Hari ini, 08:00', isActive: true },
      { id: 2, name: 'Siti Aminah', email: 'siti@kopdes.id', role: 'Kasir Shift 2', lastLogin: 'Kemarin, 15:00', isActive: true },
      { id: 3, name: 'Ahmad Faisal', email: 'ahmad@kopdes.id', role: 'Kasir Magang', lastLogin: '12 Okt 2023', isActive: false },
    ]);
  }, []);

  const handleBukaKas = (e) => {
    e.preventDefault();
    if (!kasAwal) {
      toast.error('Harap masukkan nominal kas awal');
      return;
    }
    toast.success('Kas / Shift berhasil dibuka!');
    setIsShiftOpen(true);
    setModalBukaKas(false);
  };

  const handleTutupKas = (e) => {
    e.preventDefault();
    if (!kasAkhirFisik) {
      toast.error('Harap masukkan uang fisik yang ada di laci kasir');
      return;
    }
    toast.success('Laporan Shift berhasil disimpan. Kas ditutup.');
    setIsShiftOpen(false);
    setModalTutupKas(false);
  };

  const navigateToPOS = () => {
    if (!isShiftOpen) {
      toast.error('Harap Buka Kas terlebih dahulu sebelum masuk ke POS!');
      return;
    }
    router.push('/pos');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Manajemen Kasir & Shift</h1>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => alert('Riwayat shift belum tersedia')}>
            <History size={18} /> Riwayat Shift
          </button>
          <button className={styles.btnPrimary} onClick={() => alert('Fitur tambah akun kasir belum tersedia')}>
            <Plus size={18} /> Tambah Akun Kasir
          </button>
        </div>
      </div>

      {/* SHIFT STATUS BANNER */}
      <div className={styles.shiftCard}>
        <div className={styles.shiftInfo}>
          <div className={styles.shiftItem}>
            <span className={styles.shiftLabel}>Status Shift</span>
            <div className={styles.shiftValue}>
              {isShiftOpen ? <span className={styles.activeBadge}>SEDANG AKTIF</span> : <span style={{color: 'var(--neutral-400)'}}>DITUTUP</span>}
            </div>
          </div>
          {isShiftOpen && (
            <>
              <div className={styles.shiftItem}>
                <span className={styles.shiftLabel}>Waktu Mulai</span>
                <span className={styles.shiftValue}>{new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className={styles.shiftItem}>
                <span className={styles.shiftLabel}>Kas Awal</span>
                <span className={styles.shiftValue}>Rp {Number(kasAwal).toLocaleString('id-ID')}</span>
              </div>
              <div className={styles.shiftItem}>
                <span className={styles.shiftLabel}>Pendapatan POS</span>
                <span className={styles.shiftValue}>Rp 0</span>
              </div>
            </>
          )}
        </div>
        
        <div className={styles.actions}>
          {!isShiftOpen ? (
            <button className={styles.btnPrimary} onClick={() => setModalBukaKas(true)} style={{ background: 'var(--success)'}}>
              <KeySquare size={18} /> Buka Shift & Kas
            </button>
          ) : (
            <>
              <button className={styles.btnSecondary} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} onClick={() => setModalTutupKas(true)}>
                <Clock size={18} /> Akhiri Shift
              </button>
              <button className={styles.btnPrimary} onClick={navigateToPOS}>
                <Store size={18} /> Buka Aplikasi POS
              </button>
            </>
          )}
        </div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: '700', marginTop: '16px' }}>Daftar Akun Kasir</h2>
      
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nama Kasir</th>
              <th className={styles.th}>Peran</th>
              <th className={styles.th}>Terakhir Login</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kasirs.map(k => (
              <tr key={k.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>{k.name.charAt(0)}</div>
                    <div>
                      <div className={styles.userName}>{k.name}</div>
                      <div className={styles.userEmail}>{k.email}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.td} style={{ fontWeight: '500' }}>{k.role}</td>
                <td className={styles.td}>{k.lastLogin}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${k.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                    {k.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className={styles.td}>
                  <button className={styles.btnSecondary} style={{ padding: '6px 12px', fontSize: '12px' }}>Edit Hak Akses</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL BUKA KAS */}
      {modalBukaKas && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Buka Shift & Kasir</h2>
              <button className={styles.closeBtn} onClick={() => setModalBukaKas(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleBukaKas}>
              <div className={styles.modalBody}>
                <p style={{ fontSize: '14px', color: 'var(--neutral-600)' }}>Masukkan jumlah uang tunai fisik yang ada di laci kasir saat ini sebagai modal kembalian.</p>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Modal Laci (Kas Awal)</label>
                  <div className={styles.inputPrefix}>
                    <span className={styles.prefix}>Rp</span>
                    <input type="number" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="Contoh: 500000" value={kasAwal} onChange={(e) => setKasAwal(e.target.value)} autoFocus required />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModalBukaKas(false)}>Batal</button>
                <button type="submit" className={styles.saveBtn} style={{ background: 'var(--success)' }}>Buka Kas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TUTUP KAS */}
      {modalTutupKas && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Rekap & Akhiri Shift</h2>
              <button className={styles.closeBtn} onClick={() => setModalTutupKas(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleTutupKas}>
              <div className={styles.modalBody}>
                <div className={styles.summaryBox}>
                  <div className={styles.summaryRow}>
                    <span>Kas Awal</span>
                    <span style={{ fontWeight: '600' }}>Rp {Number(kasAwal).toLocaleString('id-ID')}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Penerimaan Tunai (POS)</span>
                    <span style={{ fontWeight: '600', color: 'var(--success)' }}>+ Rp 0</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Penerimaan QRIS/Transfer</span>
                    <span style={{ fontWeight: '600', color: 'var(--info)' }}>+ Rp 0</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--neutral-200)', margin: '4px 0' }}></div>
                  <div className={styles.summaryRow} style={{ fontSize: '16px', fontWeight: '700' }}>
                    <span>Estimasi Uang di Laci</span>
                    <span>Rp {Number(kasAwal).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Uang Fisik Aktual di Laci *</label>
                  <p style={{ fontSize: '12px', color: 'var(--neutral-500)', marginBottom: '4px' }}>Hitung dan masukkan total uang tunai yang ada di laci saat ini.</p>
                  <div className={styles.inputPrefix}>
                    <span className={styles.prefix}>Rp</span>
                    <input type="number" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0" value={kasAkhirFisik} onChange={(e) => setKasAkhirFisik(e.target.value)} required />
                  </div>
                </div>

                {kasAkhirFisik && (
                  <div style={{ padding: '12px', borderRadius: '8px', background: Number(kasAkhirFisik) == Number(kasAwal) ? 'var(--success-bg)' : 'var(--danger-bg)', color: Number(kasAkhirFisik) == Number(kasAwal) ? 'var(--success)' : 'var(--danger)', fontSize: '14px', fontWeight: '600' }}>
                    {Number(kasAkhirFisik) - Number(kasAwal) === 0 
                      ? 'Kas Seimbang (Sesuai Sistem)' 
                      : `Selisih: Rp ${(Number(kasAkhirFisik) - Number(kasAwal)).toLocaleString('id-ID')} (${Number(kasAkhirFisik) - Number(kasAwal) > 0 ? 'Lebih' : 'Kurang'})`
                    }
                  </div>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModalTutupKas(false)}>Batal</button>
                <button type="submit" className={styles.saveBtn} style={{ background: 'var(--danger)' }}>Tutup Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
