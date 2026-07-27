import styles from './Footer.module.css';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>MP</div>
            <div className={styles.logoText}>
              MerahPutih<br/><span>Mart</span>
            </div>
          </div>
          <p className={styles.description}>
            Aplikasi belanja sembako murah, segar, dan berkualitas langsung dari Koperasi Desa Merah Putih. Belanja cerdas, warga sejahtera.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
            <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
            <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
          </div>
        </div>

        <div className={styles.linkSection}>
          <h4 className={styles.linkTitle}>Layanan Kami</h4>
          <ul className={styles.linkList}>
            <li><Link href="/bantuan">Pusat Bantuan</Link></li>
            <li><Link href="/cara-belanja">Cara Belanja</Link></li>
            <li><Link href="/pengiriman">Info Pengiriman</Link></li>
            <li><Link href="/pengembalian">Kebijakan Pengembalian</Link></li>
          </ul>
        </div>

        <div className={styles.linkSection}>
          <h4 className={styles.linkTitle}>Tentang KopDes</h4>
          <ul className={styles.linkList}>
            <li><Link href="/tentang">Tentang Kami</Link></li>
            <li><Link href="/lokasi">Lokasi Koperasi</Link></li>
            <li><Link href="/karir">Karir</Link></li>
            <li><Link href="/syarat">Syarat & Ketentuan</Link></li>
          </ul>
        </div>

        <div className={styles.contactSection}>
          <h4 className={styles.linkTitle}>Hubungi Kami</h4>
          <div className={styles.contactItem}>
            <MapPin size={18} className={styles.contactIcon} />
            <span>Jl. Koperasi No. 1, Desa Merah Putih, Indonesia</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={18} className={styles.contactIcon} />
            <span>+62 811 2233 4455</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={18} className={styles.contactIcon} />
            <span>halo@merahputih.id</span>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Koperasi Desa Merah Putih. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
