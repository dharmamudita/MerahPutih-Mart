const { prisma } = require('database');

/**
 * Mendapatkan Daftar Promo Nasional
 */
const getNationalPromos = async (req, res) => {
  try {
    const promos = await prisma.promotion.findMany({
      where: { isGlobal: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: promos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat daftar promo' });
  }
};

/**
 * Menambahkan Promo Nasional Baru
 */
const createNationalPromo = async (req, res) => {
  try {
    const { name, description, type, value, isPercentage, startDate, endDate } = req.body;

    const newPromo = await prisma.promotion.create({
      data: {
        name,
        description,
        type, // DISCOUNT, CASHBACK
        value,
        isPercentage,
        isGlobal: true,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true
      }
    });

    res.status(201).json({ success: true, data: newPromo, message: 'Promo Nasional berhasil dibuat' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal membuat promo' });
  }
};

module.exports = {
  getNationalPromos,
  createNationalPromo
};
