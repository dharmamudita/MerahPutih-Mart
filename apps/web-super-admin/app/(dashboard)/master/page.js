'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Tag, Search, ShieldCheck, Layers, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MasterData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/superadmin/categories');
      const json = await res.json();
      if (json.success && json.data) setCategories(json.data);
    } catch (error) {
      toast.error('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  const mockCategories = categories.length > 0 ? categories : [
    { id: 1, name: 'Sembako & Pangan Pokok', description: 'Beras, Minyak Goreng, Gula, Tepung, Telur', _count: { products: 48 } },
    { id: 2, name: 'Snack & Minuman Warga', description: 'Biskuit, Kopi Tubruk, Teh, Air Mineral', _count: { products: 36 } },
    { id: 3, name: 'Kesehatan & Kebersihan', description: 'Sabun Mandi, Shampo, Deterjen, Masker', _count: { products: 24 } },
    { id: 4, name: 'Pupuk & Pertanian Desa', description: 'Pupuk Urea, NPK, Benih Padi, Obat Hama', _count: { products: 18 } },
  ];

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

  const filteredCategories = mockCategories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Master Data Nasional</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Standarisasi Katalog Kategori, Komoditas Utama, dan Satuan Unit secara nasional.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah Kategori Global
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={28} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Kategori Komoditas</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>{mockCategories.length} Kategori</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>Tersinkron di 142 Kopdes</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={28} color="var(--info)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Total Produk Terdaftar</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>126 Item Sembako</div>
            <div style={{ fontSize: '12px', color: 'var(--info)', fontWeight: '700' }}>SKU Terstandarisasi</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Standar HET Nasional</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--success)' }}>Terkunci</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600' }}>Harga Eceran Tertinggi Terjamin</div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', backgroundColor: 'rgba(248, 250, 252, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--neutral-200)', width: '360px' }}>
            <Search size={18} color="var(--neutral-400)" />
            <input 
              type="text" 
              placeholder="Cari Kategori atau Deskripsi..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }} 
            />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '6px 16px', borderRadius: '20px' }}>
            {filteredCategories.length} Kategori Global
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>NAMA KATEGORI</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>DESKRIPSI & KOMODITAS</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>TERPAKAI DI PRODUK</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '50px', color: 'var(--neutral-500)' }}>Memuat data master...</td></tr>
              ) : filteredCategories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                  <td style={{ padding: '18px 24px', fontWeight: '800', color: 'var(--primary-700)', fontSize: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} color="var(--primary-600)" /> {cat.name}
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', color: 'var(--neutral-700)', fontSize: '13px' }}>{cat.description || '-'}</td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', background: 'var(--neutral-100)', color: 'var(--neutral-800)' }}>
                      {cat._count?.products || 30} Item SKU
                    </span>
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    <button onClick={() => handleDelete(cat.id)} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={14} /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH KATEGORI */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--neutral-200)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--neutral-900)' }}>Tambah Kategori Global Baru</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: 'var(--neutral-500)' }}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Nama Kategori</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px', outline: 'none' }} placeholder="Misal: Sembako & Bahan Pokok" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Deskripsi Ringkas</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', resize: 'vertical', fontSize: '14px', outline: 'none' }} placeholder="Penjelasan komoditas dalam kategori ini..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Batal</button>
                <button type="submit" className="btn-primary">Simpan Kategori</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
