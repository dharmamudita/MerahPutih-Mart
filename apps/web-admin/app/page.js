export default function Home() {
  return (
    <div>
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '16px', color: 'var(--primary-600)' }}>Selamat Datang di KopDes Management</h1>
        <p style={{ color: 'var(--neutral-500)', marginBottom: '32px' }}>
          Sistem Informasi Manajemen Terpadu Koperasi Desa Merah Putih
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn btn-primary">Dashboard Super Admin</button>
          <button className="btn btn-outline">Dashboard Admin Kopdes</button>
        </div>
      </div>
    </div>
  );
}
