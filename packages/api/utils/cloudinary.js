const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload gambar dari buffer ke Cloudinary
 * @param {Buffer} buffer - File buffer dari multer
 * @param {String} folder - Nama folder di Cloudinary (misal: 'products')
 * @returns {Promise<Object>} - Mengembalikan object cloudinary
 */
const uploadToCloudinary = (buffer, folder = 'merahputih') => {
  return new Promise((resolve, reject) => {
    // Jika tidak ada konfigurasi Cloudinary, kembalikan string kosong atau dummy
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      console.warn("⚠️ Cloudinary belum dikonfigurasi. Menggunakan gambar dummy.");
      return resolve({
        secure_url: 'https://via.placeholder.com/500?text=Gambar+Produk',
        public_id: 'dummy_image_id'
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    uploadStream.end(buffer);
  });
};

/**
 * Menghapus gambar dari Cloudinary berdasarkan public_id
 * @param {String} publicId - Public ID gambar
 */
const deleteFromCloudinary = async (publicId) => {
  if (publicId === 'dummy_image_id') return true; // Bypass untuk dummy image
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from cloudinary:', error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
