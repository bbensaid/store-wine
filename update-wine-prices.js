const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateWinePrices() {
  try {
    console.log('Updating featured wine prices to $199...');
    
    const result = await prisma.wine.updateMany({
      where: {
        featured: true,
      },
      data: {
        price: 19900, // $199 in cents
      },
    });
    
    console.log(`Updated ${result.count} featured wines to $199`);
    
    // Verify the update
    const wines = await prisma.wine.findMany({
      where: {
        featured: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
      take: 5, // Show first 5 wines
    });
    
    console.log('Sample updated featured wines:');
    wines.forEach(wine => {
      console.log(`- ${wine.name}: $${(wine.price / 100).toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('Error updating wine prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWinePrices(); 