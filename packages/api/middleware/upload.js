const multer = require('multer');

// Gunakan memory storage agar kita bisa akses buffer file untuk diupload stream ke Cloudinary
const storage = multer.memoryStorage();

// Filter file hanya memperbolehkan gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Hanya gambar yang diperbolehkan.'), false);
  }
};

// Batasan ukuran: 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
