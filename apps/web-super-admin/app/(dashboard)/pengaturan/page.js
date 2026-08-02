'use client';
import { useState } from 'react';
import { Settings, Save, Shield, Key, Bell, Database, Server, Lock, RefreshCw, CheckCircle, Smartphone, HardDriveDownload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PengaturanSystemPage() {
  const [activeTab, setActiveTab] = useState('UMUM'); // UMUM | KEAMANAN | API | NOTIFIKASI | BACKUP
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Konfigurasi sistem berhasil disimpan!');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--neutral-900)', letterSpacing: '-0.5px' }}>Pengaturan Sistem Pusat</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '14px' }}>Konfigurasi parameter global, keamanan API, notifikasi otomatis, dan integrasi nasional.</p>
        </div>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={18} /> {saved ? 'Berhasil Disimpan!' : 'Simpan Perubahan'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Navigation Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
          <button 
            onClick={() => setActiveTab('UMUM')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'UMUM' ? 'var(--primary-50)' : 'transparent',
              color: activeTab === 'UMUM' ? 'var(--primary-700)' : 'var(--neutral-600)',
              fontWeight: activeTab === 'UMUM' ? '800' : '600', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Settings size={18} color={activeTab === 'UMUM' ? 'var(--primary-600)' : 'currentColor'} /> Umum & Identitas
          </button>

          <button 
            onClick={() => setActiveTab('KEAMANAN')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'KEAMANAN' ? 'var(--primary-50)' : 'transparent',
              color: activeTab === 'KEAMANAN' ? 'var(--primary-700)' : 'var(--neutral-600)',
              fontWeight: activeTab === 'KEAMANAN' ? '800' : '600', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Shield size={18} color={activeTab === 'KEAMANAN' ? 'var(--primary-600)' : 'currentColor'} /> Keamanan & Akses
          </button>

          <button 
            onClick={() => setActiveTab('API')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'API' ? 'var(--primary-50)' : 'transparent',
              color: activeTab === 'API' ? 'var(--primary-700)' : 'var(--neutral-600)',
              fontWeight: activeTab === 'API' ? '800' : '600', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Key size={18} color={activeTab === 'API' ? 'var(--primary-600)' : 'currentColor'} /> API & Secret Key
          </button>

          <button 
            onClick={() => setActiveTab('NOTIFIKASI')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'NOTIFIKASI' ? 'var(--primary-50)' : 'transparent',
              color: activeTab === 'NOTIFIKASI' ? 'var(--primary-700)' : 'var(--neutral-600)',
              fontWeight: activeTab === 'NOTIFIKASI' ? '800' : '600', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Bell size={18} color={activeTab === 'NOTIFIKASI' ? 'var(--primary-600)' : 'currentColor'} /> Notifikasi System
          </button>

          <button 
            onClick={() => setActiveTab('BACKUP')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              backgroundColor: activeTab === 'BACKUP' ? 'var(--primary-50)' : 'transparent',
              color: activeTab === 'BACKUP' ? 'var(--primary-700)' : 'var(--neutral-600)',
              fontWeight: activeTab === 'BACKUP' ? '800' : '600', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Database size={18} color={activeTab === 'BACKUP' ? 'var(--primary-600)' : 'currentColor'} /> Backup & Recovery
          </button>
        </div>

        {/* Configuration Forms */}
        <div className="glass-card">
          {activeTab === 'UMUM' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neutral-900)' }}>
                <Server size={20} color="var(--primary-600)" /> Parameter Identitas & Sistem Utama
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Nama Portal Pusat Kendali</label>
                  <input type="text" defaultValue="MerahPutih-Mart Pusat Kendali Nasional" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Ambang Batas Stok Kritis Nasional (Default Threshold)</label>
                  <input type="number" defaultValue={10} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px', outline: 'none' }} />
                  <span style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '6px', display: 'block' }}>Setiap Kopdes yang persediaan komoditas utamanya di bawah batas ini akan otomatis memicu peringatan kritis.</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Mode Pemeliharaan (Maintenance Mode)</label>
                  <select defaultValue="OFF" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px', outline: 'none' }}>
                    <option value="OFF">Nonaktif (Sistem Berjalan Normal)</option>
                    <option value="ON">Aktif (Kios Kasir POS & App Customer Dimatikan Sementara)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Frekuensi Otomatis Backup Data</label>
                  <select defaultValue="DAILY" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px', outline: 'none' }}>
                    <option value="DAILY">Setiap Hari (Pukul 00:00 WIB)</option>
                    <option value="HOURLY">Setiap 6 Jam</option>
                    <option value="WEEKLY">Setiap Minggu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'KEAMANAN' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neutral-900)' }}>
                <Lock size={20} color="var(--primary-600)" /> Keamanan Protokol & Akses Super Admin
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Batas Durasi Sesi Login (Session Timeout)</label>
                  <select defaultValue="8" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px' }}>
                    <option value="2">2 Jam (Maksimal Keamanan)</option>
                    <option value="8">8 Jam (Standar Kerja Shift)</option>
                    <option value="24">24 Jam</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Autentikasi Dua Faktor (2FA Multi-Factor)</label>
                  <select defaultValue="OPTIONAL" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px' }}>
                    <option value="MANDATORY">Wajib untuk Semua Super Admin</option>
                    <option value="OPTIONAL">Opsional (Rekomendasi)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Proteksi Brute-Force Login</label>
                  <input type="number" defaultValue={5} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px' }} />
                  <span style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px', display: 'block' }}>Blokir IP otomatis setelah 5 kali gagal percobaan kata sandi berturut-turut.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'API' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neutral-900)' }}>
                <Key size={20} color="var(--primary-600)" /> Kunci API & Webhook Integration
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Production Secret API Key</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="password" readOnly defaultValue="mp_live_sk_99281a82fbc0192837162b" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px', background: 'var(--neutral-50)', fontFamily: 'monospace' }} />
                    <button className="btn-outline" onClick={() => toast.success('Secret Key disalin!')}>Salin</button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Webhook Endpoint Sinkronisasi Nasional</label>
                  <input type="text" defaultValue="https://api.merahputihmart.id/v1/national-sync" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Rate Limit per Menit</label>
                  <input type="number" defaultValue={1000} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--neutral-300)', fontSize: '14px' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NOTIFIKASI' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neutral-900)' }}>
                <Bell size={20} color="var(--primary-600)" /> Notifikasi System & Alerts
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', borderRadius: '10px', border: '1px solid var(--neutral-200)', background: 'white' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Kirim WhatsApp Alert untuk Stok Kritis</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Notifikasi otomatis ke Pengurus Kopdes jika stok sembako menipis.</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '14px', borderRadius: '10px', border: '1px solid var(--neutral-200)', background: 'white' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>Laporan Email Rekap Setoran Harian Pukul 20:00 WIB</div>
                    <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Ringkasan setoran kas dari 142 cabang Kopdes langsung ke Super Admin.</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'BACKUP' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neutral-900)' }}>
                <Database size={20} color="var(--primary-600)" /> Backup & Recovery Database
              </h3>

              <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--primary-50)', border: '1px solid var(--primary-200)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-900)' }}>Status Cadangan Terakhir</div>
                  <div style={{ fontSize: '13px', color: 'var(--primary-700)', marginTop: '4px' }}>Hari ini Pukul 00:00 WIB (2.4 GB - PostgreSQL Snapshot)</div>
                </div>
                <button className="btn-primary" onClick={() => toast.success('Backup manual berhasil dipicu!')}>
                  <HardDriveDownload size={16} /> Jalankan Backup Manual
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}