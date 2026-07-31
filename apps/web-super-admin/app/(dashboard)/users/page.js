'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Users, Plus, Search, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManajemenPengguna() {
  const [users, setUsers] = useState([]);
  const [kopdesList, setKopdesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'ADMIN_KOPDES', kopdesId: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchKopdes();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/superadmin/users');
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const fetchKopdes = async () => {
    try {
      const res = await apiFetch('/superadmin/kopdes');
      const json = await res.json();
      if (json.success) setKopdesList(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'ADMIN_KOPDES' && !formData.kopdesId) {
      toast.error('Silakan pilih cabang Koperasi Desa');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch('/superadmin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (res.ok) {
        toast.success('Akun berhasil dibuat!');
        setShowModal(false);
        fetchUsers();
        setFormData({ name: '', email: '', phone: '', password: '', role: 'ADMIN_KOPDES', kopdesId: '' });
      } else {
        toast.error(json.message || 'Gagal membuat akun');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const res = await apiFetch(`/superadmin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Akun berhasil di-${newStatus === 'BLOCKED' ? 'blokir' : 'aktifkan'}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Gagal mengubah status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Manajemen Pengguna</h1>
          <p style={{ color: 'var(--neutral-500)' }}>Kelola akun Admin Kopdes dan Super Admin.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah Admin Baru
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--neutral-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--neutral-200)', width: '320px' }}>
            <Search size={18} color="var(--neutral-400)" />
            <input type="text" placeholder="Cari nama atau email..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--neutral-500)' }}>
            Total: {users.length} Akun
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Pengguna</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Kontak</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Lokasi Cabang</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Memuat data...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Belum ada pengguna.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--neutral-900)' }}>{u.name}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--neutral-900)' }}>{u.email}</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{u.phone || '-'}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {u.role === 'SUPER_ADMIN' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', backgroundColor: 'var(--neutral-900)', color: 'white', fontSize: '11px', fontWeight: '700' }}>
                        <ShieldCheck size={12} /> PUSAT
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', fontSize: '11px', fontWeight: '700' }}>
                        <Users size={12} /> ADMIN CABANG
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--neutral-700)' }}>
                    {u.kopdes ? <span style={{ fontWeight: '600' }}>{u.kopdes.name}</span> : <span style={{ fontStyle: 'italic', color: 'var(--neutral-400)' }}>Semua Akses (Global)</span>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {u.status === 'ACTIVE' ? (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--success)', color: 'white', fontSize: '12px', fontWeight: '700' }}>Aktif</span>
                    ) : (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '12px', fontWeight: '700' }}>Diblokir</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleStatus(u.id, u.status)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--neutral-200)', background: 'white', cursor: 'pointer', color: u.status === 'ACTIVE' ? 'var(--danger)' : 'var(--success)' }} 
                      title={u.status === 'ACTIVE' ? 'Blokir Akun' : 'Aktifkan Akun'}
                    >
                      {u.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Pengguna */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Tambah Admin Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Nama Lengkap</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }} placeholder="Budi Santoso" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }} placeholder="budi@kopdes.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Password Sementara</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }} placeholder="Min. 6 karakter" minLength={6} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Pilih Role (Hak Akses)</label>
                <select name="role" value={formData.role} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }}>
                  <option value="ADMIN_KOPDES">Admin Kopdes (Cabang)</option>
                  <option value="SUPER_ADMIN">Super Admin (Pusat)</option>
                </select>
              </div>

              {formData.role === 'ADMIN_KOPDES' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Tugaskan ke Koperasi Desa</label>
                  <select name="kopdesId" value={formData.kopdesId} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--neutral-300)', outline: 'none' }}>
                    <option value="">-- Pilih Kopdes --</option>
                    {kopdesList.filter(k => k.status === 'ACTIVE').map(k => (
                      <option key={k.id} value={k.id}>{k.name} - {k.city}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--neutral-300)', background: 'white', fontWeight: '600' }}>Batal</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
