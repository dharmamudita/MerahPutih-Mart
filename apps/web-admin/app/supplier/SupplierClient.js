'use client';
import { useState, useEffect } from 'react';
import styles from './Supplier.module.css';
import { Plus, Search, MapPin, Phone, Mail, Building2, ExternalLink, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function SupplierClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '', // API tidak punya field kategori, kita simpan di address atau skip
    contactName: '',
    phone: '',
    email: '',
    address: ''
  });

  const fetchData = async () => {
    try {
      const res = await api.get(`/suppliers?kopdesId=${DEV_KOPDES_ID}`);
      if (res.data.success) {
        setSuppliers(res.data.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data supplier');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.contactName && s.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { ...formData, kopdesId: DEV_KOPDES_ID };
      const res = await api.post('/suppliers', payload);
      
      if (res.data.success) {
        toast.success('Supplier baru berhasil ditambahkan');
        setIsModalOpen(false);
        setFormData({ name: '', category: '', contactName: '', phone: '', email: '', address: '' });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambah supplier');
    } finally {
      setIsLoading(false);
    }
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
            <div><span className={styles.supplierCategory}>Supplier</span></div>
            
            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <Phone size={14} className={styles.infoIcon} />
                <span>{s.phone || '-'} ({s.contactName || '-'})</span>
              </div>
              <div className={styles.infoRow}>
                <Mail size={14} className={styles.infoIcon} />
                <span>{s.email || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <MapPin size={14} className={styles.infoIcon} style={{ flexShrink: 0 }} />
                <span>{s.address || '-'}</span>
              </div>
            </div>
            
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '16px' }}>
              Bergabung: <strong>{new Date(s.createdAt).toLocaleDateString('id-ID')}</strong>
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
                  <input type="text" className={styles.input} required placeholder="Contoh: PT Sumber Rejeki" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kategori Barang</label>
                  <input type="text" className={styles.input} placeholder="Contoh: Sembako / Minuman" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nama Kontak (PIC)</label>
                    <input type="text" className={styles.input} placeholder="Nama orang..." value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>No. Telepon / WA *</label>
                    <input type="text" className={styles.input} required placeholder="08..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input type="email" className={styles.input} placeholder="opsional@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Alamat Lengkap</label>
                  <textarea className={styles.textarea} rows="3" placeholder="Alamat gudang / kantor pusat..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
