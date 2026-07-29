const { prisma } = require('database');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * Get all products (with filters)
 */
const getAllProducts = async (req, res) => {
  try {
    const { 
      kopdesId, 
      categoryId, 
      search,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    const whereClause = {
      isActive: true
    };
    
    if (kopdesId) whereClause.kopdesId = kopdesId;
    if (categoryId) whereClause.categoryId = categoryId;
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch data and count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: { select: { id: true, name: true } },
          unit: { select: { id: true, name: true, symbol: true } },
          images: {
            orderBy: { isPrimary: 'desc' },
            take: 1
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: parseInt(limit)
      }),
      prisma.product.count({ where: whereClause })
    ]);

    res.status(200).json({ 
      success: true, 
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data produk.' });
  }
};

/**
 * Get single product by slug or ID
 */
const getProductByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: {
        category: true,
        unit: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        kopdes: { select: { id: true, name: true, city: true } }
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail produk.' });
  }
};

/**
 * Create a new product (Admin KopDes)
 */
const createProduct = async (req, res) => {
  try {
    const { 
      sku, barcode, name, slug, description, 
      buyPrice, sellPrice, discount, stockQuantity, minStock,
      categoryId, brandId, unitId, kopdesId 
    } = req.body;

    // Pastikan user punya akses ke Kopdes ini (jika bukan SUPER_ADMIN)
    if (req.user.role === 'ADMIN_KOPDES' && req.user.kopdesId !== kopdesId) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses untuk menambah produk di Kopdes lain.' });
    }

    // Buat produk
    const newProduct = await prisma.product.create({
      data: {
        sku, barcode, name, slug, description,
        buyPrice: parseFloat(buyPrice || 0),
        sellPrice: parseFloat(sellPrice || 0),
        discount: parseFloat(discount || 0),
        stockQuantity: parseInt(stockQuantity || 0),
        minStock: parseInt(minStock || 5),
        categoryId: categoryId || null,
        brandId: brandId || null,
        unitId: unitId || null,
        kopdesId
      }
    });

    // Handle foto jika ada
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file, index) => {
        const uploadResult = await uploadToCloudinary(file.buffer, 'products');
        return prisma.productImage.create({
          data: {
            productId: newProduct.id,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id || 'dummy',
            isPrimary: index === 0, // Gambar pertama jadi primary
            sortOrder: index
          }
        });
      });
      await Promise.all(imagePromises);
    }

    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'SKU atau Slug sudah digunakan di Kopdes ini.' });
    }
    res.status(500).json({ success: false, message: 'Gagal menambahkan produk.' });
  }
};

/**
 * Update a product
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      sku, barcode, name, slug, description, 
      buyPrice, sellPrice, discount, stockQuantity, minStock,
      categoryId, brandId, unitId, isActive
    } = req.body;

    const data = {
      sku, barcode, name, slug, description,
      categoryId: categoryId || null,
      brandId: brandId || null,
      unitId: unitId || null
    };

    if (buyPrice !== undefined) data.buyPrice = parseFloat(buyPrice);
    if (sellPrice !== undefined) data.sellPrice = parseFloat(sellPrice);
    if (discount !== undefined) data.discount = parseFloat(discount);
    if (stockQuantity !== undefined) data.stockQuantity = parseInt(stockQuantity);
    if (minStock !== undefined) data.minStock = parseInt(minStock);
    if (isActive !== undefined) data.isActive = (isActive === 'true' || isActive === true);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    });

    res.status(200).json({ success: true, message: 'Produk berhasil diupdate', data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Gagal mengupdate produk.' });
  }
};

/**
 * Delete a product
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Cek apakah produk ini ada di transaksi/order, jika ada mungkin lebih baik diset isActive = false saja

    await prisma.product.delete({
      where: { id }
    });

    res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus produk.' });
  }
};

module.exports = {
  getAllProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct
};
