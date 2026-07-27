import styles from './Navbar.module.css';
import Link from 'next/link';
import { Search, ShoppingCart, User, MapPin } from 'lucide-react';

export default function Navbar() {
  return (
    <div className={styles.navbarWrapper}>
      {/* Top bar for location and promos */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <div className={styles.location}>
              <MapPin size={14} />
              <span>Dikirim ke: <strong>KopDes Sindangjaya</strong></span>
            </div>
            <div className={styles.promoText}>
              Gratis ongkir untuk pengiriman ke seluruh desa Merah Putih!
            </div>
            <div className={styles.topLinks}>
              <Link href="/bantuan">Bantuan</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={styles.mainNav}>
        <div className={`container ${styles.navContent}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>MP</div>
            <div className={styles.logoText}>
              MerahPutih<br/><span>Mart</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Cari sembako, snack, atau kebutuhan sehari-hari..." 
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/cart" className={styles.cartBtn}>
              <ShoppingCart size={24} />
              <span className={styles.cartBadge}>2</span>
            </Link>
            <div className={styles.divider}></div>
            <Link href="/login" className={`btn btn-outline ${styles.loginBtn}`}>Masuk</Link>
            <Link href="/register" className="btn btn-primary">Daftar</Link>
          </div>
        </div>
      </nav>
      
      {/* Categories Bar */}
      <div className={styles.catBar}>
        <div className={`container ${styles.catContent}`}>
          <Link href="/kategori/sembako" className={styles.catItem}>Sembako</Link>
          <Link href="/kategori/snack" className={styles.catItem}>Snack & Minuman</Link>
          <Link href="/kategori/kesehatan" className={styles.catItem}>Kesehatan</Link>
          <Link href="/kategori/kebersihan" className={styles.catItem}>Kebersihan</Link>
          <Link href="/kategori/pertanian" className={styles.catItem}>Kebutuhan Tani</Link>
          <Link href="/promo" className={`${styles.catItem} ${styles.promo}`}>Promo Spesial</Link>
        </div>
      </div>
    </div>
  );
}
