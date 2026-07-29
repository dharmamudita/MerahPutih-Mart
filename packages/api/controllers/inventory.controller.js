const { prisma } = require('database');

/**
 * Mendapatkan semua produk beserta stok (Untuk Gudang)
 */
const getInventory = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        unit: true,
      },
      orderBy: { stockQuantity: 'asc' } // Yang mau habis duluan di atas
    });
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat persediaan barang.' });
  }
};

/**
 * Melakukan mutasi barang (Barang Masuk / Keluar)
 */
const mutateStock = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;
    // type: 'IN' atau 'OUT'
    
    if (!productId || !type || !quantity) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) return res.status(400).json({ success: false, message: 'Kuantitas harus lebih dari 0.' });

    // Atomic Transaction: Update stok dan catat riwayat
    const result = await prisma.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error('Produk tidak ditemukan.');

      if (type === 'OUT' && product.stockQuantity < qty) {
        throw new Error('Stok tidak mencukupi untuk dikeluarkan.');
      }

      const previousQty = product.stockQuantity;
      const currentQty = type === 'IN' ? previousQty + qty : previousQty - qty;

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: currentQty }
      });

      const movement = await prisma.stockMovement.create({
        data: {
          productId,
          kopdesId: req.user.kopdesId || updatedProduct.kopdesId,
          type: type === 'IN' ? 'IN' : (reason === 'Barang Rusak' ? 'DAMAGED' : (reason === 'Barang Kadaluarsa' ? 'EXPIRED' : 'OUT')),
          quantity: qty,
          previousQty,
          currentQty,
          notes: reason || 'Penyesuaian manual',
          createdBy: req.user.name || 'Admin'
        }
      });

      // Jika IN dan ada opsi bayar supplier, catat pengeluaran (tapi kita skip dulu sesuai persetujuan default)

      return { updatedProduct, movement };
    });

    res.status(200).json({ 
      success: true, 
      message: `Stok berhasil di${type === 'IN' ? 'tambah' : 'kurangi'}.`, 
      data: result.updatedProduct 
    });
  } catch (error) {
    console.error('Inventory mutation error:', error);
    if (error.message) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Gagal melakukan mutasi stok.' });
  }
};

/**
 * Mendapatkan riwayat mutasi stok
 */
const getMovements = async (req, res) => {
  try {
    const { kopdesId } = req.query;
    const whereClause = kopdesId ? { kopdesId } : {};

    const movements = await prisma.stockMovement.findMany({
      where: whereClause,
      include: {
        product: { select: { id: true, name: true, sku: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit 50 data terakhir untuk riwayat
    });

    res.status(200).json({ success: true, data: movements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memuat riwayat stok.' });
  }
};

module.exports = {
  getInventory,
  mutateStock,
  getMovements
};
