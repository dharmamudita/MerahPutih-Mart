'use client';
import { useState } from 'react';
import styles from './FloatingChat.module.css';
import { MessageCircle, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Simulate sending message to WhatsApp/Admin
    toast.success('Pesan Anda diteruskan ke WhatsApp Admin!');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>CS Koperasi Merah Putih</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Online - Siap membantu Anda</div>
            </div>
            <button onClick={toggleChat} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.chatBody}>
            <div className={styles.chatBubbleAdmin}>
              Halo! Ada yang bisa kami bantu seputar pesanan atau produk Koperasi? 😊
            </div>
          </div>
          
          <form className={styles.chatFooter} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ketik pesan Anda..." 
              className={styles.chatInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn} disabled={!message.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button className={`${styles.fab} ${isOpen ? styles.hidden : ''}`} onClick={toggleChat}>
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
