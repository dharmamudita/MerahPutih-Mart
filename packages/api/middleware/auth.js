const jwt = require('jsonwebtoken');
const { prisma } = require('database');

/**
 * Middleware untuk memverifikasi JWT token
 */
const verifyToken = async (req, res, next) => {
  try {
    let token;
    
    // Cek header authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek apakah user masih ada di database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, status: true, kopdesId: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User dengan token ini sudah tidak ada.' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Akun Anda tidak aktif atau diblokir.' });
    }

    // Set user ke request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesi Anda telah habis (token expired).' });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
};

/**
 * Middleware Role Based Access Control
 * @param  {...string} roles - Array role yang diizinkan (misal: 'SUPER_ADMIN', 'ADMIN_KOPDES')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Tidak terautentikasi.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role Anda (${req.user.role}) tidak diizinkan mengakses resource ini.` 
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorize };
