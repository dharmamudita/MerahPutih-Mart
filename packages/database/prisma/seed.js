const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai seeder Koperasi Desa Merah Putih...');

  // 1. Buat KopDes Pusat / Default
  const kopdes = await prisma.kopdes.upsert({
    where: { code: 'KOPDES-001' },
    update: {},
    create: {
      code: 'KOPDES-001',
      name: 'Koperasi Desa Merah Putih (Pusat)',
      description: 'Koperasi percontohan utama untuk program Merah Putih',
      address: 'Jl. Merdeka No. 17',
      province: 'Jawa Barat',
      city: 'Kabupaten Bandung',
      district: 'Soreang',
      village: 'Soreang',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Kopdes created:', kopdes.name);

  // 2. Buat Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@merahputih.id' },
    update: {},
    create: {
      email: 'admin@merahputih.id',
      // Password hash untuk: admin123 (nanti pakai bcrypt di production, ini dummy dulu)
      password: 'hashed_password_placeholder', 
      name: 'Super Admin Pusat',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Super Admin created:', admin.email);

  // 3. Buat Kategori Produk Dasar
  const categories = [
    { name: 'Sembako', slug: 'sembako', isGlobal: true },
    { name: 'Snack & Minuman', slug: 'snack-minuman', isGlobal: true },
    { name: 'Kebutuhan Tani', slug: 'kebutuhan-tani', isGlobal: true },
    { name: 'Kebersihan', slug: 'kebersihan', isGlobal: true }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug_kopdesId: { slug: cat.slug, kopdesId: '' } }, // Dummy where since we don't know the exact unique constraint matching here. Wait, schema says @@unique([slug, kopdesId]). But kopdesId is optional. If null, Prisma might complain about unique on null. Let's just create them.
      update: {},
      create: { ...cat }
    }).catch(async (e) => {
        // Fallback for optional fields
        const existing = await prisma.category.findFirst({ where: { slug: cat.slug }});
        if (!existing) await prisma.category.create({ data: cat });
    });
  }
  console.log('✅ Categories created');

  // 4. Buat Satuan
  const units = [
    { name: 'Kilogram', symbol: 'kg' },
    { name: 'Liter', symbol: 'L' },
    { name: 'Pieces', symbol: 'pcs' },
    { name: 'Dus', symbol: 'dus' },
    { name: 'Paket', symbol: 'pkt' }
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: {},
      create: { ...unit }
    });
  }
  console.log('✅ Units created');

  // 5. Buat Dummy Products
  console.log('Membuat dummy products...');
  
  // Ambil ID kategori dan unit
  const sembako = await prisma.category.findFirst({ where: { slug: 'sembako' }});
  const snack = await prisma.category.findFirst({ where: { slug: 'snack-minuman' }});
  const tani = await prisma.category.findFirst({ where: { slug: 'kebutuhan-tani' }});
  
  const kg = await prisma.unit.findFirst({ where: { name: 'Kilogram' }});
  const pcs = await prisma.unit.findFirst({ where: { name: 'Pieces' }});

  const dummyProducts = [
    {
      sku: 'PRD-001',
      name: 'Beras Premium Maknyus 5kg',
      slug: 'beras-premium-maknyus-5kg',
      description: 'Beras putih pulen berkualitas tanpa pemutih buatan.',
      buyPrice: 62000,
      sellPrice: 68000,
      stockQuantity: 150,
      kopdesId: kopdes.id,
      categoryId: sembako?.id,
      unitId: pcs?.id,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop'
    },
    {
      sku: 'PRD-002',
      name: 'Minyak Goreng Bimoli 2L',
      slug: 'minyak-goreng-bimoli-2l',
      description: 'Minyak goreng kelapa sawit murni.',
      buyPrice: 32000,
      sellPrice: 34500,
      stockQuantity: 80,
      kopdesId: kopdes.id,
      categoryId: sembako?.id,
      unitId: pcs?.id,
      image: 'https://images.unsplash.com/photo-1628186178306-646e3fb0e93a?q=80&w=1000&auto=format&fit=crop'
    },
    {
      sku: 'PRD-003',
      name: 'Indomie Goreng Special',
      slug: 'indomie-goreng-special',
      description: 'Mie instan goreng sejuta umat.',
      buyPrice: 2800,
      sellPrice: 3200,
      stockQuantity: 300,
      kopdesId: kopdes.id,
      categoryId: snack?.id,
      unitId: pcs?.id,
      image: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c8166?q=80&w=1000&auto=format&fit=crop'
    },
    {
      sku: 'PRD-004',
      name: 'Pupuk Urea Non-Subsidi 50kg',
      slug: 'pupuk-urea-non-subsidi-50kg',
      description: 'Pupuk penyubur tanaman berkualitas tinggi.',
      buyPrice: 320000,
      sellPrice: 350000,
      stockQuantity: 20,
      kopdesId: kopdes.id,
      categoryId: tani?.id,
      unitId: pcs?.id,
      image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1000&auto=format&fit=crop'
    },
    {
      sku: 'PRD-005',
      name: 'Gula Pasir Gulaku 1kg',
      slug: 'gula-pasir-gulaku-1kg',
      description: 'Gula pasir putih bersih berkualitas.',
      buyPrice: 15500,
      sellPrice: 17000,
      stockQuantity: 50,
      kopdesId: kopdes.id,
      categoryId: sembako?.id,
      unitId: kg?.id,
      image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414655?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  for (const prod of dummyProducts) {
    const { image, ...productData } = prod;
    
    // Check if product exists
    let product = await prisma.product.findFirst({
      where: { slug: prod.slug, kopdesId: prod.kopdesId }
    });

    if (!product) {
      product = await prisma.product.create({ data: productData });
      
      // Create image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: image,
          publicId: `dummy_${prod.sku}`,
          isPrimary: true
        }
      });
      console.log(`✅ Product created: ${product.name}`);
    } else {
      console.log(`ℹ️ Product already exists: ${product.name}`);
    }
  }

  console.log('Seeder selesai! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
