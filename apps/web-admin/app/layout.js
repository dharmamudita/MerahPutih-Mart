import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../components/AdminLayout.module.css";
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Admin Kopdes - MerahPutih Mart",
  description: "Dashboard Administrasi Koperasi Desa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.adminLayout}>
          <Sidebar />
          <div className={styles.mainContent}>
            <Header />
            <main className={styles.pageContent}>
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
