const { prisma } = require('database');

/**
 * Mendapatkan daftar seluruh Kopdes
 */
const getAllKopdes = async (req, res) => {
  try {
    const kopdes = await prisma.kopdes.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true, customers: true, transactions: true }
        }
      }
    });

    res.status(200).json({ success: true, data: kopdes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat data Kopdes' });
  }
};

/**
 * Menambahkan Kopdes Baru
 */
const createKopdes = async (req, res) => {
  try {
    const { name, code, address, province, city, district, village, phone, email } = req.body;
    
    // Validasi kode unik
    const existingKopdes = await prisma.kopdes.findUnique({ where: { code } });
    if (existingKopdes) {
      return res.status(400).json({ success: false, message: 'Kode Kopdes sudah terdaftar' });
    }

    const newKopdes = await prisma.kopdes.create({
      data: {
        name,
        code,
        address,
        province,
        city,
        district,
        village,
        phone,
        email,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ success: true, data: newKopdes, message: 'Kopdes berhasil ditambahkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan Kopdes' });
  }
};

/**
 * Mengupdate data Kopdes
 */
const updateKopdes = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, province, city, district, village, phone, email } = req.body;
    
    const updated = await prisma.kopdes.update({
      where: { id },
      data: { name, address, province, city, district, village, phone, email }
    });

    res.status(200).json({ success: true, data: updated, message: 'Data Kopdes berhasil diubah' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengupdate Kopdes' });
  }
};

/**
 * Mengubah status Kopdes (Aktif / Nonaktif)
 */
const changeKopdesStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE, INACTIVE, SUSPENDED

    const updated = await prisma.kopdes.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, data: updated, message: `Status Kopdes berhasil diubah menjadi ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status Kopdes' });
  }
};

module.exports = {
  getAllKopdes,
  createKopdes,
  updateKopdes,
  changeKopdesStatus
};
