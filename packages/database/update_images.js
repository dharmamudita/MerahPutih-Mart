const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const artifactDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\80a83371-43fe-4ba8-b3ef-35f26384a0ab';
  const publicDir = path.join(__dirname, '..', '..', 'apps', 'web-customer', 'public', 'products');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const updates = [
    { sku: 'PRD-001', file: 'beras_5kg_1785265340115.png' },
    { sku: 'PRD-002', file: 'minyak_2l_1785265350852.png' },
    { sku: 'PRD-003', file: 'indomie_goreng_1785265362022.png' },
    { sku: 'PRD-004', file: 'pupuk_urea_1785265371290.png' },
    { sku: 'PRD-005', file: 'gula_1kg_1785265381498.png' },
  ];

  for (const item of updates) {
    const src = path.join(artifactDir, item.file);
    const destName = item.file; // e.g. beras_5kg_...png
    const dest = path.join(publicDir, destName);
    const dbUrl = `/products/${destName}`;

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${item.file} to public/products/`);
      
      // Update Database
      const product = await prisma.product.findFirst({
        where: { sku: item.sku }
      });
      
      if (product) {
        await prisma.productImage.updateMany({
          where: { productId: product.id },
          data: { url: dbUrl }
        });
        console.log(`Updated image for ${product.name} to ${dbUrl}`);
      }
    } else {
      console.error(`File not found: ${src}`);
    }
  }

  console.log('Update Complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
