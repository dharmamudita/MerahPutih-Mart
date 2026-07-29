'use client';
import { useState } from 'react';
import styles from './Supplier.module.css';
import { Plus, Search, MapPin, Phone, Mail, Building2, ExternalLink, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SupplierClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [suppliers] = useState([
    {
      id: 1,
      name: 'PT Bumi Pangan Sejahtera',
      category: 'Sembako Utama',
      contactPerson: 'Bpk. Hendra',
      phone: '081234567890',
      email: 'hendra@bumipangan.co.id',
      address: 'Kawasan Industri Candi, Semarang',
      lastRestock: '12 Okt 2023'
    },
    {
      id: 2,
      name: 'Distributor Pertanian Mandiri',
      category: 'Alat & Pupuk',
      contactPerson: 'Ibu Ratna',
      phone: '085611223344',
      email: 'ratna@pertanianmandiri.com',
      address: 'Jl. Raya Demak - Kudus Km 5',
      lastRestock: '20 Sep 2023'
    },
    {
      id: 3,
      name: 'CV Tirta Makmur (Aqua)',
      category: 'Minuman',
      contactPerson: 'Sandi',
      phone: '081999888777',
      email: '-',
      address: 'Gudang Pusat Kudus',
      lastRestock: 'Kemarin'
    }
  ]);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Supplier baru berhasil ditambahkan');
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manajemen Supplier</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px', marginTop: '4px' }}>Kelola daftar pemasok untuk restock gudang</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={18} color="var(--neutral-400)" />
            <input 
              type="text" 
              placeholder="Cari nama supplier..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Tambah Supplier
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredSuppliers.map(s => (
          <div key={s.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.supplierIcon}>
                <Building2 size={24} />
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--neutral-400)', cursor: 'pointer' }}>
                <ExternalLink size={18} />
              </button>
            </div>
            
            <div className={styles.supplierName}>{s.name}</div>
            <div><span className={styles.supplierCategory}>{s.category}</span></div>
            
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <Phone size={14} className={styles.infoIcon} />
                <span>{s.phone} ({s.contactPerson})</span>
              </div>
              <div className={styles.infoRow}>
                <Mail size={14} className={styles.infoIcon} />
                <span>{s.email}</span>
              </div>
              <div className={styles.infoRow}>
                <MapPin size={14} className={styles.infoIcon} style={{ flexShrink: 0 }} />
                <span>{s.address}</span>
              </div>
            </div>
            
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '16px' }}>
              Restock Terakhir: <strong>{s.lastRestock}</strong>
            </div>

            <div className={styles.cardFooter}>
              <button className={styles.actionBtn}>
                <Edit2 size={14} /> Edit
              </button>
              <button className={styles.actionBtn} style={{ color: 'var(--danger)' }}>
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Tambah Supplier Baru</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nama Perusahaan / Supplier *</label>
                  <input type="text" className={styles.input} required placeholder="Contoh: PT Sumber Rejeki" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kategori Barang *</label>
                  <input type="text" className={styles.input} required placeholder="Contoh: Sembako / Minuman" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nama Kontak (PIC)</label>
                    <input type="text" className={styles.input} placeholder="Nama orang..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>No. Telepon / WA *</label>
                    <input type="text" className={styles.input} required placeholder="08..." />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input type="email" className={styles.input} placeholder="opsional@email.com" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Alamat Lengkap</label>
                  <textarea className={styles.textarea} rows="3" placeholder="Alamat gudang / kantor pusat..."></textarea>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className={styles.btnPrimary}>Simpan Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
