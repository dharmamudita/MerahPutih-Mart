const { prisma } = require('database');

const getSuppliers = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

    const suppliers = await prisma.supplier.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat data supplier.' });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, contactName, phone, email, address, kopdesId } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama supplier wajib diisi.' });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        contactName,
        phone,
        email,
        address,
        kopdesId: req.user.kopdesId || kopdesId
      }
    });

    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal menambah supplier.' });
  }
};

module.exports = {
  getSuppliers,
  createSupplier
};
