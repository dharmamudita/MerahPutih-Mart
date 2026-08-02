'use client';
import { apiFetch } from '../../../lib/api';
import { useState, useEffect } from 'react';
import { Users, Plus, Search, ShieldCheck, UserX, UserCheck, Key, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManajemenPengguna() {
  const [users, setUsers] = useState([]);
  const [kopdesList, setKopdesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      if (json.success && json.data) setUsers(json.data);
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
      if (json.success && json.data) setKopdesList(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  const mockUsers = users.length > 0 ? users : [
    { id: 1, name: 'Budi Admin', email: 'budi@kopdes.id', phone: '08123456789', role: 'ADMIN_KOPDES', kopdes: { name: 'Kopdes Merah Putih Sukamaju' }, status: 'ACTIVE' },
    { id: 2, name: 'Super Admin Pusat', email: 'admin@merahputih.id', phone: '0811223344', role: 'SUPER_ADMIN', kopdes: null, status: 'ACTIVE' },
    { id: 3, name: 'Siti Rahma', email: 'siti@slemana.kopdes.id', phone: '08567890123', role: 'ADMIN_KOPDES', kopdes: { name: 'Kopdes Harapan Desa' }, status: 'ACTIVE' },
  ];

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
        toast.success('Akun pengelola berhasil dibuat!');
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

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.kopdes?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Manajemen Pengguna & Otoritas</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Kelola hak akses pengelola cabang Admin Kopdes dan Super Admin Pusat.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Buat Akun Pengelola Baru
        </button>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={28} color="var(--primary-600)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Total Pengelola Terdaftar</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>{mockUsers.length} Akun</div>
            <div style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '700' }}>Terenkripsi Bcrypt</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="var(--info)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Super Admin Pusat</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)' }}>{mockUsers.filter(u => u.role === 'SUPER_ADMIN').length} Akun</div>
            <div style={{ fontSize: '12px', color: 'var(--info)', fontWeight: '700' }}>Akses Otoritas Penuh</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={28} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '700', textTransform: 'uppercase' }}>Admin Cabang Aktif</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--success)' }}>{mockUsers.filter(u => u.role === 'ADMIN_KOPDES').length} Akun</div>
            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: '600' }}>Terhubung ke Kasir & Stok</div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--neutral-200)', width: '360px' }}>
            <Search size={18} color="var(--neutral-400)" />
            <input 
              type="text" 
              placeholder="Cari Nama, Email, atau Cabang..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }} 
            />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '6px 16px', borderRadius: '20px' }}>
            Total {filteredUsers.length} Pengguna
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Nama Pengguna</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Email & Kontak</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Role (Hak Akses)</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Cabang Ditugaskan</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Status Akun</th>
                <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: 'var(--neutral-500)' }}>Memuat data pengguna...</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--neutral-100)', backgroundColor: 'white' }}>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--neutral-900)', fontSize: '14px' }}>{u.name}</div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-800)' }}>{u.email}</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '2px' }}>{u.phone || '-'}</div>
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    {u.role === 'SUPER_ADMIN' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--neutral-900)', color: 'white', fontSize: '11px', fontWeight: '800' }}>
                        <ShieldCheck size={14} color="#fef08a" /> SUPER ADMIN PUSAT
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', fontSize: '11px', fontWeight: '800' }}>
                        <Users size={14} /> ADMIN KOPDES
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '18px 24px', fontSize: '14px', color: 'var(--neutral-700)' }}>
                    {u.kopdes ? <span style={{ fontWeight: '700', color: 'var(--primary-700)' }}>{u.kopdes.name}</span> : <span style={{ fontStyle: 'italic', color: 'var(--neutral-400)' }}>Semua Akses (Nasional)</span>}
                  </td>
                  <td style={{ padding: '18px 24px' }}>
                    {u.status === 'ACTIVE' ? (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '12px', fontWeight: '800' }}>Aktif</span>
                    ) : (
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '12px', fontWeight: '800' }}>Diblokir</span>
                    )}
                  </td>
                  <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleStatus(u.id, u.status)}
                      style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--neutral-200)', background: 'white', cursor: 'pointer', color: u.status === 'ACTIVE' ? 'var(--danger)' : 'var(--success)', fontWeight: '700', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }} 
                      title={u.status === 'ACTIVE' ? 'Blokir Akun' : 'Aktifkan Akun'}
                    >
                      {u.status === 'ACTIVE' ? <UserX size={14} /> : <UserCheck size={14} />} {u.status === 'ACTIVE' ? 'Blokir' : 'Buka Blokir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', border: '1px solid rgba(225, 29, 72, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid var(--neutral-200)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--neutral-900)' }}>Tambah Akun Admin Baru</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: 'var(--neutral-500)' }}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Nama Lengkap Pengelola</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px' }} placeholder="Budi Santoso" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Email Akses Login</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px' }} placeholder="budi@sukamaju.kopdes.id" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Password Akun (Bcrypt Hash)</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px' }} placeholder="Min. 6 karakter" minLength={6} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Pilih Role (Hak Akses)</label>
                <select name="role" value={formData.role} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px' }}>
                  <option value="ADMIN_KOPDES">Admin Kopdes (Cabang Desa)</option>
                  <option value="SUPER_ADMIN">Super Admin (Pusat Induk)</option>
                </select>
              </div>

              {formData.role === 'ADMIN_KOPDES' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Tugaskan ke Koperasi Desa</label>
                  <select name="kopdesId" value={formData.kopdesId} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--neutral-300)', outline: 'none', fontSize: '14px' }}>
                    <option value="">-- Pilih Cabang Kopdes --</option>
                    {kopdesList.filter(k => k.status === 'ACTIVE').map(k => (
                      <option key={k.id} value={k.id}>{k.name} - {k.city}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Batal</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Memproses...' : 'Buat Akun Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
