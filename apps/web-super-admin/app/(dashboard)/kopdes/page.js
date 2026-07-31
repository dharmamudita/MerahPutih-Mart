'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit2, PowerOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManajemenKopdes() {
  const [kopdesList, setKopdesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    code: '', name: '', address: '', province: '', city: '', district: '', village: '', phone: '', email: ''
  });

  useEffect(() => {
    fetchKopdes();
  }, []);

  const fetchKopdes = async () => {
    try {
      const res = await apiFetch('/superadmin/kopdes');
      const json = await res.json();
      if (json.success) setKopdesList(json.data);
    } catch (error) {
      toast.error('Gagal memuat data Kopdes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/superadmin/kopdes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Koperasi Desa berhasil ditambahkan!');
        setShowModal(false);
        fetchKopdes();
        setFormData({ code: '', name: '', address: '', province: '', city: '', district: '', village: '', phone: '', email: '' });
      } else {
        toast.error(json.message || 'Gagal menambahkan Kopdes');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await apiFetch(`/superadmin/kopdes/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Status berhasil diubah menjadi ${newStatus}`);
        fetchKopdes();
      }
    } catch (error) {
      toast.error('Gagal mengubah status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Manajemen Kopdes</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Kelola seluruh cabang Koperasi Desa di seluruh Indonesia.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah Kopdes Baru
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--neutral-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--neutral-200)', width: '320px' }}>
            <Search size={18} color="var(--neutral-400)" />
            <input type="text" placeholder="Cari Kode atau Nama Kopdes..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--neutral-500)' }}>
            Total: {kopdesList.length} Kopdes
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Kode</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Koperasi Desa</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Lokasi</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Pelanggan</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</td></tr>
            ) : kopdesList.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Belum ada Koperasi Desa yang terdaftar.</td></tr>
            ) : (
              kopdesList.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white', transition: 'all 0.2s' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: 'var(--primary-600)' }}>{k.code}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{k.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{k.phone || '-'}</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--neutral-700)' }}>{k.city}, {k.province}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>{k._count?.customers || 0}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {k.status === 'ACTIVE' ? (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', fontSize: '12px', fontWeight: '700' }}>Aktif</span>
                    ) : (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '12px', fontWeight: '700' }}>Nonaktif</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--neutral-200)', background: 'white', cursor: 'pointer', color: 'var(--info)' }} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(k.id, k.status)}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--neutral-200)', background: 'white', cursor: 'pointer', color: k.status === 'ACTIVE' ? 'var(--danger)' : 'var(--success)' }} 
                        title={k.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktivasi'}
                      >
                        {k.status === 'ACTIVE' ? <PowerOff size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Kopdes */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Tambah Koperasi Desa Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Kode Kopdes</label>
                  <input type="text" name="code" value={formData.code} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }} placeholder="KD-001" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nama Koperasi</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }} placeholder="Kopdes Merah Putih Makmur" />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Alamat Lengkap</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }} placeholder="Jl. Raya Desa No. 10" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Provinsi</label>
                  <input type="text" name="province" value={formData.province} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Kota / Kabupaten</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nomor Telepon</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--neutral-300)', background: 'white', fontWeight: '600' }}>Batal</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Koperasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
