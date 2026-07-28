import ProfileClient from './ProfileClient';

export const metadata = {
  title: 'Profil Saya - Koperasi Desa Merah Putih',
  description: 'Kelola informasi profil Anda.',
};

export default function ProfilePage() {
  return (
    <div style={{ minHeight: '80vh', backgroundColor: 'var(--neutral-50)' }}>
      <ProfileClient />
    </div>
  );
}
