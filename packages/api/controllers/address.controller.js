const { prisma } = require('database');

const getAddresses = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { userId: req.user.id }
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer tidak ditemukan.' });
    }

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId: customer.id },
      orderBy: { isDefault: 'desc' }
    });

    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil alamat.', error: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const { label, recipientName, phone, address, province, city, district, subdistrict, postalCode, isDefault } = req.body;

    let customer = await prisma.customer.findUnique({
      where: { userId: req.user.id }
    });

    if (!customer) {
      // Jika belum ada customer profile, buatkan
      customer = await prisma.customer.create({
        data: {
          userId: req.user.id,
          user: { connect: { id: req.user.id } }
        }
      });
    }

    // Jika isDefault true, set false untuk alamat lain
    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.customerAddress.create({
      data: {
        customer: { connect: { id: customer.id } },
        label,
        recipientName,
        phone,
        address,
        province,
        city,
        district,
        postalCode,
        isDefault: isDefault || false
      }
    });

    res.status(201).json({ success: true, data: newAddress, message: 'Alamat berhasil ditambahkan.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan alamat.', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, recipientName, phone, address, province, city, district, postalCode, isDefault } = req.body;
    
    const existingAddress = await prisma.customerAddress.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!existingAddress || existingAddress.customer.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Alamat tidak ditemukan atau tidak ada akses.' });
    }

    if (isDefault) {
      await prisma.customerAddress.updateMany({
        where: { customerId: existingAddress.customerId },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.customerAddress.update({
      where: { id },
      data: {
        label, recipientName, phone, address, province, city, district, postalCode, isDefault
      }
    });

    res.status(200).json({ success: true, data: updatedAddress, message: 'Alamat berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui alamat.', error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingAddress = await prisma.customerAddress.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!existingAddress || existingAddress.customer.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Alamat tidak ditemukan atau tidak ada akses.' });
    }

    await prisma.customerAddress.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Alamat berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus alamat.', error: error.message });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
