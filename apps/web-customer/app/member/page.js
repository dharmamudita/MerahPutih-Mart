import MemberClient from './MemberClient';

export const metadata = {
  title: 'Dashboard Member - Koperasi Desa Merah Putih',
  description: 'Kelola keanggotaan dan poin loyalty Anda',
};

export default function MemberPage() {
  return (
    <div style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh', paddingBottom: '60px' }}>
      <MemberClient />
    </div>
  );
}
