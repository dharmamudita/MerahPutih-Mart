'use client';
import { useState, useEffect } from 'react';
import styles from './Kategori.module.css';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { DEV_KOPDES_ID } from '../../lib/constants';

export default function KategoriClient() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data dari API
  const fetchCategories = async () => {
    try {
      const res = await api.get(`/categories?kopdesId=${DEV_KOPDES_ID}`);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      toast.error('Gagal mengambil data kategori dari server.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Nama kategori wajib diisi!');
      return;
    }

    setIsLoading(true);
    try {
      if (editingCategory) {
        // Update API
        await api.put(`/categories/${editingCategory.id}`, {
          ...formData,
          slug: formData.name.toLowerCase().replace(/ /g, '-')
        });
        toast.success('Kategori berhasil diupdate');
      } else {
        // Create API
        await api.post('/categories', {
          ...formData,
          slug: formData.name.toLowerCase().replace(/ /g, '-'),
          kopdesId: DEV_KOPDES_ID
        });
        toast.success('Kategori berhasil ditambahkan');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan kategori.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal menghapus kategori.');
      }
    }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Manajemen Kategori</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.searchBox}>
            <Search size={18} color="var(--neutral-400)" />
            <input 
              type="text" 
              placeholder="Cari kategori..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nama Kategori</th>
              <th className={styles.th}>Deskripsi</th>
              <th className={styles.th}>Jumlah Produk</th>
              <th className={styles.th} style={{ width: '100px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(cat => (
              <tr key={cat.id} className={styles.tr}>
                <td className={styles.td} style={{ fontWeight: '600', color: 'var(--neutral-900)' }}>{cat.name}</td>
                <td className={styles.td}>{cat.description}</td>
                <td className={styles.td}>
                  <span style={{ background: 'var(--neutral-100)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                    {cat._count?.products || 0} Produk
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionCell}>
                    <button className={styles.editBtn} onClick={() => handleOpenModal(cat)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id)} title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="4" className={styles.td} style={{ textAlign: 'center', padding: '40px' }}>
                  Kategori tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nama Kategori</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Contoh: Sembako" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Deskripsi (Opsional)</label>
                  <textarea 
                    className={styles.input} 
                    placeholder="Penjelasan singkat kategori" 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal} disabled={isLoading}>Batal</button>
                <button type="submit" className={styles.saveBtn} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
