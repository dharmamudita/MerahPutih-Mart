const { prisma } = require('database');
const bcrypt = require('bcryptjs');

/**
 * Mendapatkan daftar seluruh Pengguna (Admin Kopdes & Super Admin)
 */
const getAllAdminUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN_KOPDES', 'SUPER_ADMIN'] }
      },
      include: {
        kopdes: { select: { name: true, code: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat data pengguna' });
  }
};

/**
 * Membuat Akun Admin Kopdes Baru
 */
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, kopdesId } = req.body;
    
    // Validasi email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'ADMIN_KOPDES',
        kopdesId: role === 'SUPER_ADMIN' ? null : kopdesId,
        status: 'ACTIVE'
      }
    });

    // Hilangkan password dari response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ success: true, data: userWithoutPassword, message: 'Akun admin berhasil dibuat' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal membuat akun admin' });
  }
};

/**
 * Mengubah status blokir / aktif pengguna
 */
const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE, BLOCKED

    const updated = await prisma.user.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, data: { id: updated.id, status: updated.status }, message: `Status pengguna berhasil diubah menjadi ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status pengguna' });
  }
};

module.exports = {
  getAllAdminUsers,
  createAdminUser,
  changeUserStatus
};
