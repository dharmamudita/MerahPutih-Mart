const { prisma } = require('database');

/**
 * MASTER DATA: KATEGORI
 */
const getGlobalCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isGlobal: true },
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat kategori' });
  }
};

const createGlobalCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    
    const newCat = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isGlobal: true
      }
    });
    res.status(201).json({ success: true, data: newCat, message: 'Kategori global ditambahkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambah kategori' });
  }
};

const deleteGlobalCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Kategori dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kategori' });
  }
};

module.exports = {
  getGlobalCategories,
  createGlobalCategory,
  deleteGlobalCategory
};
