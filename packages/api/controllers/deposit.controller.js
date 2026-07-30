const { prisma } = require('database');

/**
 * Mendapatkan Daftar Setoran Harian dari Seluruh Kopdes
 */
const getAllDeposits = async (req, res) => {
  try {
    const deposits = await prisma.dailyDeposit.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        kopdes: { select: { name: true, city: true } },
        user: { select: { name: true } }
      }
    });

    res.status(200).json({ success: true, data: deposits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat daftar setoran' });
  }
};

/**
 * Memverifikasi / Menolak Setoran
 */
const verifyDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // VERIFIED, REJECTED
    // Asumsi super admin di-hardcode ID nya jika tidak auth strict
    const verifierId = req.user?.id || 'super_admin_id'; // Dummy jika auth bypass

    const deposit = await prisma.dailyDeposit.findUnique({ where: { id } });
    if (!deposit) return res.status(404).json({ success: false, message: 'Setoran tidak ditemukan' });

    // Update status di DailyDeposit
    const updated = await prisma.dailyDeposit.update({
      where: { id },
      data: { status }
    });

    // Catat verifikasi
    // Lewati jika foreign key user ID tidak valid (bypass)
    // Tapi kita langsung update aja tabel dailyDeposit
    
    // Kirim notifikasi (opsional, dummy dulu)

    res.status(200).json({ success: true, data: updated, message: `Setoran berhasil di ${status === 'VERIFIED' ? 'verifikasi' : 'tolak'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memverifikasi setoran' });
  }
};

module.exports = {
  getAllDeposits,
  verifyDeposit
};
