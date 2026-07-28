import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingChat from "../components/FloatingChat";

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
  title: "MerahPutih Mart | Belanja Sembako Koperasi Desa",
  description: "Aplikasi belanja sembako murah dari Koperasi Desa Merah Putih",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
