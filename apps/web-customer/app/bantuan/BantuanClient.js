'use client';
import { useState } from 'react';
import styles from './Bantuan.module.css';
import { HelpCircle, MessageSquare, ChevronDown, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const FAQS = [
  {
    question: 'Bagaimana cara mendaftar sebagai Member?',
    answer: 'Anda otomatis menjadi Member Silver saat mendaftar akun di Koperasi Desa Merah Putih. Tingkatkan terus transaksi Anda untuk naik ke level Gold dan Platinum.'
  },
  {
    question: 'Berapa lama waktu pengiriman?',
    answer: 'Untuk opsi "Diantar ke Rumah", pesanan akan diantar pada hari yang sama (Same Day) oleh kurir desa jika dipesan sebelum pukul 15:00. Pesanan di atas jam tersebut dikirim keesokan harinya.'
  },
  {
    question: 'Bagaimana cara menggunakan Poin?',
    answer: 'Pada saat Checkout, centang opsi "Gunakan Poin" di bagian ringkasan pembayaran. 1 Poin bernilai Rp 100.'
  },
  {
    question: 'Apakah bisa retur barang rusak?',
    answer: 'Tentu. Anda dapat mengajukan retur dengan membawa barang langsung ke Koperasi atau menghubungi Admin via formulir pengaduan dalam kurun waktu 1x24 jam setelah barang diterima.'
  }
];

export default function BantuanClient() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    orderNo: '',
    message: ''
  });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Harap isi subjek dan pesan keluhan');
      return;
    }

    setIsSubmitting(true);
    // Simulasi API kirim pengaduan
    setTimeout(() => {
      toast.success('Pesan Anda telah terkirim! Admin akan segera membalas via Email atau WhatsApp.');
      setFormData({ subject: '', orderNo: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pusat Bantuan</h1>
        <p className={styles.subtitle}>Kami siap membantu Anda! Temukan jawaban atas pertanyaan umum atau hubungi langsung layanan pelanggan kami.</p>
      </div>

      <div className={styles.layout}>
        {/* FAQ Section */}
        <div>
          <h2 className={styles.sectionTitle}>
            <HelpCircle color="var(--primary-600)" /> Pertanyaan Populer
          </h2>
          <div className={styles.accordion}>
            {FAQS.map((faq, index) => (
              <div key={index} className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}>
                <button className={styles.accordionHeader} onClick={() => toggleAccordion(index)}>
                  {faq.question}
                  <ChevronDown className={styles.accordionIcon} size={20} />
                </button>
                {activeIndex === index && (
                  <div className={styles.accordionContent}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
          <h2 className={styles.sectionTitle}>
            <MessageSquare color="var(--primary-600)" /> Hubungi Kami
          </h2>
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Subjek / Topik</label>
                <select name="subject" className={styles.formInput} value={formData.subject} onChange={handleChange}>
                  <option value="">Pilih Topik...</option>
                  <option value="pengiriman">Masalah Pengiriman</option>
                  <option value="pembayaran">Masalah Pembayaran</option>
                  <option value="produk">Keluhan Produk Rusak</option>
                  <option value="akun">Pertanyaan Akun / Poin</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nomor Pesanan (Opsional)</label>
                <input 
                  type="text" 
                  name="orderNo" 
                  placeholder="Contoh: INV-2026..." 
                  className={styles.formInput} 
                  value={formData.orderNo} 
                  onChange={handleChange} 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Detail Keluhan / Pesan</label>
                <textarea 
                  name="message" 
                  placeholder="Tuliskan secara detail masalah Anda di sini..." 
                  className={styles.formInput} 
                  rows="5"
                  style={{ resize: 'vertical' }}
                  value={formData.message} 
                  onChange={handleChange} 
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : <><Send size={18} /> Kirim Pesan</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
