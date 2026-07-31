const { prisma } = require('database');

// Ambil semua notifikasi user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await prisma.notification.findMany({
      where: { 
        OR: [
          { userId: userId },
          { isGlobal: true }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to latest 50
    });

    const unreadCount = notifications.filter(n => !n.isRead && !n.isGlobal).length; // simple approximation

    res.status(200).json({ 
      success: true, 
      data: notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi.', error: error.message });
  }
};

// Tandai notifikasi sudah dibaca
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId: userId, isRead: false },
        data: { isRead: true }
      });
      return res.status(200).json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca.' });
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.status(200).json({ success: true, message: 'Notifikasi ditandai sudah dibaca.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update notifikasi.', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};
