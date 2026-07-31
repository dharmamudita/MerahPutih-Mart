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

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status harus VERIFIED atau REJECTED' });
    }

    const deposit = await prisma.dailyDeposit.findUnique({ where: { id } });
    if (!deposit) return res.status(404).json({ success: false, message: 'Setoran tidak ditemukan' });

    // Update status di DailyDeposit
    const updated = await prisma.dailyDeposit.update({
      where: { id },
      data: { status, notes: notes || undefined }
    });

    // Catat verifikasi (audit trail)
    await prisma.depositVerification.create({
      data: {
        deposit: { connect: { id } },
        verifier: { connect: { id: verifierId } },
        status,
        notes: notes || null
      }
    }).catch(() => {}); // Jangan gagalkan flow jika verifier invalid

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
