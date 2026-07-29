'use client';
import { useState, useEffect } from 'react';
import styles from './Kategori.module.css';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KategoriClient() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Mock data for UI Showcase
  useEffect(() => {
    setCategories([
      { id: 1, name: 'Sembako', description: 'Beras, Minyak, Gula, dll', totalProducts: 45 },
      { id: 2, name: 'Pertanian', description: 'Pupuk, Bibit, Obat Hama', totalProducts: 12 },
      { id: 3, name: 'Makanan Ringan', description: 'Snack, Biskuit', totalProducts: 30 },
      { id: 4, name: 'Minuman', description: 'Air mineral, Teh, Kopi', totalProducts: 25 },
    ]);
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Nama kategori wajib diisi!');
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      toast.success('Kategori berhasil diupdate');
    } else {
      setCategories([...categories, { id: Date.now(), ...formData, totalProducts: 0 }]);
      toast.success('Kategori berhasil ditambahkan');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Kategori berhasil dihapus');
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
                    {cat.totalProducts} Produk
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
                <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>Batal</button>
                <button type="submit" className={styles.saveBtn}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
