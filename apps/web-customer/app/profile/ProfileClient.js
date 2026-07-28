'use client';

import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { User, Mail, Phone, Save, ShieldCheck, Lock, MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfileClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, address
  const [loading, setLoading] = useState(false);
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ id: '', label: '', recipientName: '', phone: '', address: '', province: '', city: '', district: '', postalCode: '', isDefault: false });

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || ''
    });
    
    fetchAddresses(storedToken);
  }, [router]);

  const fetchAddresses = async (token) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAddresses(data.data || []);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: formData.name, phone: formData.phone })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Profil berhasil diperbarui!');
        const updatedUser = { ...user, name: data.data.name, phone: data.data.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        toast.error(data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Password baru dan konfirmasi tidak cocok!');
    }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          currentPassword: passwordData.currentPassword, 
          newPassword: passwordData.newPassword 
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Password berhasil diubah!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Gagal mengubah password');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const isEditing = !!addressForm.id;
      const url = isEditing ? `${apiUrl}/addresses/${addressForm.id}` : `${apiUrl}/addresses`;
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(addressForm)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(isEditing ? 'Alamat diperbarui!' : 'Alamat ditambahkan!');
        fetchAddresses(token);
        setShowAddressForm(false);
        setAddressForm({ id: '', label: '', recipientName: '', phone: '', address: '', province: '', city: '', district: '', postalCode: '', isDefault: false });
      } else {
        toast.error(data.message || 'Gagal menyimpan alamat');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm('Hapus alamat ini?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Alamat dihapus');
        fetchAddresses(token);
      }
    } catch (error) {
      toast.error('Gagal menghapus alamat');
    }
  };

  const editAddress = (addr) => {
    setAddressForm(addr);
    setShowAddressForm(true);
  };

  if (!mounted || !user) return null;

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <h1 className={styles.title}>Akun Saya</h1>
      
      <div className={styles.layout}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarCircle}>{user.name.charAt(0).toUpperCase()}</div>
            <div className={styles.avatarInfo}>
              <h3>{user.name}</h3>
              <p><ShieldCheck size={14} color="var(--success)" /> Terverifikasi</p>
            </div>
          </div>
          
          <div className={styles.navMenu}>
            <button className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={18} /> Data Diri
            </button>
            <button className={`${styles.navItem} ${activeTab === 'security' ? styles.active : ''}`} onClick={() => setActiveTab('security')}>
              <Lock size={18} /> Keamanan
            </button>
            <button className={`${styles.navItem} ${activeTab === 'address' ? styles.active : ''}`} onClick={() => setActiveTab('address')}>
              <MapPin size={18} /> Alamat Saya
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          <div className={styles.bentoCard}>
            
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit}>
                <h2 className={styles.sectionTitle}>Ubah Data Diri</h2>
                <div className={styles.formGroup}>
                  <label>Nama Lengkap</label>
                  <div className={styles.inputWrapper}>
                    <User size={18} className={styles.inputIcon} />
                    <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={styles.input} required />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input type="email" value={formData.email} className={styles.input} disabled />
                  </div>
                  <p className={styles.helperText}>Email tidak dapat diubah.</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Nomor Telepon</label>
                  <div className={styles.inputWrapper}>
                    <Phone size={18} className={styles.inputIcon} />
                    <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={styles.input} placeholder="Contoh: 08123456789" />
                  </div>
                </div>

                <div className={styles.actions}>
                  <button type="submit" className={styles.saveBtn} disabled={loading}>
                    <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit}>
                <h2 className={styles.sectionTitle}>Ubah Password</h2>
                <div className={styles.formGroup}>
                  <label>Password Saat Ini</label>
                  <div className={styles.inputWrapper}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className={styles.input} required />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Password Baru</label>
                  <div className={styles.inputWrapper}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className={styles.input} required />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Konfirmasi Password Baru</label>
                  <div className={styles.inputWrapper}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className={styles.input} required />
                  </div>
                </div>

                <div className={styles.actions}>
                  <button type="submit" className={styles.saveBtn} disabled={loading}>
                    <Save size={18} /> {loading ? 'Memproses...' : 'Ubah Password'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'address' && (
              <div>
                <div className={styles.flexBetween}>
                  <h2 className={styles.sectionTitle}>Alamat Saya</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className={styles.addBtn}>
                      <Plus size={16} /> Tambah Alamat
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Label Alamat (Cth: Rumah, Kantor)</label>
                        <input type="text" value={addressForm.label} onChange={(e) => setAddressForm({...addressForm, label: e.target.value})} className={styles.input} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Nama Penerima</label>
                        <input type="text" value={addressForm.recipientName} onChange={(e) => setAddressForm({...addressForm, recipientName: e.target.value})} className={styles.input} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Nomor Telepon</label>
                        <input type="text" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className={styles.input} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Kota/Kabupaten</label>
                        <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className={styles.input} required />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Alamat Lengkap</label>
                      <textarea value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} className={styles.input} rows="3" required></textarea>
                    </div>
                    
                    <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} />
                      <label htmlFor="isDefault" style={{ margin: 0 }}>Jadikan Alamat Utama</label>
                    </div>

                    <div className={styles.actions} style={{ gap: '12px' }}>
                      <button type="button" onClick={() => setShowAddressForm(false)} className={styles.cancelBtn}>Batal</button>
                      <button type="submit" className={styles.saveBtn} disabled={loading}>
                        <Save size={18} /> Simpan Alamat
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.addressList}>
                    {addresses.length === 0 ? (
                      <div className={styles.emptyAddress}>Belum ada alamat tersimpan.</div>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className={`${styles.addressCard} ${addr.isDefault ? styles.defaultAddress : ''}`}>
                          <div className={styles.addressHeader}>
                            <div className={styles.addressLabel}>
                              {addr.label} {addr.isDefault && <span className={styles.badge}>Utama</span>}
                            </div>
                            <div className={styles.addressActions}>
                              <button onClick={() => editAddress(addr)} className={styles.iconBtn}><Edit2 size={16} /></button>
                              <button onClick={() => deleteAddress(addr.id)} className={styles.iconBtnDanger}><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <div className={styles.addressBody}>
                            <strong>{addr.recipientName}</strong>
                            <p>{addr.phone}</p>
                            <p>{addr.address}, {addr.city}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
