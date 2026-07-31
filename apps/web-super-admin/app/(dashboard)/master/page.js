'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Tag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MasterData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/superadmin/categories');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (error) {
      toast.error('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/superadmin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Kategori global berhasil ditambahkan!');
        setShowModal(false);
        fetchCategories();
        setFormData({ name: '', description: '' });
      }
    } catch (error) {
      toast.error('Gagal menambah kategori');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    try {
      const res = await apiFetch(`/superadmin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      }
    } catch (error) {
      toast.error('Gagal menghapus kategori');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Master Data</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Kelola data Kategori, Satuan, dan Brand secara nasional.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah Kategori Global
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: '700' }}>Total Kategori Nasional</h3>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{categories.length} Kategori</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', backgroundColor: 'var(--neutral-50)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Tag size={20} color="var(--primary-600)" />
          <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Daftar Kategori Nasional</h2>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)' }}>NAMA KATEGORI</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)' }}>DESKRIPSI</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)' }}>TERPAKAI DI PRODUK</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                <td style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--primary-700)' }}>{cat.name}</td>
                <td style={{ padding: '16px 24px', color: 'var(--neutral-600)' }}>{cat.description || '-'}</td>
                <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: '600' }}>{cat._count?.products || 0}</td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <button onClick={() => handleDelete(cat.id)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '400px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Tambah Kategori Global</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nama Kategori</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--neutral-300)' }} placeholder="Misal: Sembako" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Deskripsi</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--neutral-300)', resize: 'vertical' }} placeholder="Penjelasan singkat..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--neutral-300)', background: 'white', fontWeight: '600' }}>Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
