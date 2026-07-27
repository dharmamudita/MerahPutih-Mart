import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'KopDes Management',
  description: 'Sistem Manajemen Koperasi Desa Merah Putih',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  )
}
