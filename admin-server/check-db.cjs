const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    where: {
      name: { contains: 'Mango' }
    }
  });
  console.log('Mango Products:', products.map(p => ({ id: p.id, name: p.name, image: p.image })));

  const pineapples = await prisma.product.findMany({
    where: {
      name: { contains: 'Pineapple' }
    }
  });
  console.log('Pineapple Products:', pineapples.map(p => ({ id: p.id, name: p.name, image: p.image })));
}

check().finally(() => prisma.$disconnect());
