const { prisma } = require('database');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * Get all categories
 */
const getAllCategories = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    
    // Filter by kopdesId (lokal) or isGlobal = true (pusat)
    const whereClause = {
      OR: [
        { isGlobal: true }
      ]
    };
    
    if (kopdesId) {
      whereClause.OR.push({ kopdesId });
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data kategori.' });
  }
};

/**
 * Create a new category
 */
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, kopdesId, isGlobal } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Nama dan Slug wajib diisi.' });
    }

    let iconUrl = null;
    
    // Jika ada file gambar diupload
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, 'categories');
      iconUrl = uploadResult.secure_url;
    }

    // Hanya SUPER_ADMIN yang bisa buat isGlobal = true
    const isGlobalBool = req.user.role === 'SUPER_ADMIN' ? (isGlobal === 'true' || isGlobal === true) : false;

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon: iconUrl,
        kopdesId: kopdesId || null,
        isGlobal: isGlobalBool
      }
    });

    res.status(201).json({ success: true, message: 'Kategori berhasil dibuat', data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Cek constraint unik
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Slug kategori sudah digunakan.' });
    }
    
    res.status(500).json({ success: false, message: 'Gagal membuat kategori.' });
  }
};

/**
 * Update a category
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;
    
    // Authorization check could be added here to ensure they own the category

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug, description }
    });

    res.status(200).json({ success: true, message: 'Kategori berhasil diupdate', data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Gagal mengupdate kategori.' });
  }
};

/**
 * Delete a category
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Cek apakah masih ada produk di kategori ini sebelum menghapus
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Tidak bisa menghapus kategori yang masih memiliki produk.' });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.status(200).json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori.' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
