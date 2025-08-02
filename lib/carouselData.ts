// Shared carousel data structure
export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  wineId?: number; // Reference to database wine
}

// Default carousel data (will be replaced by database data)
export const defaultCarouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Premium Red Wines",
    subtitle: "Discover our finest collection of aged reds",
    description: "From bold Cabernets to elegant Pinot Noirs, experience the depth and complexity of our premium red wine selection.",
    imageUrl: "/images/wines/hero1.jpeg"
  },
  {
    id: 2,
    title: "Exclusive White Wines",
    subtitle: "Crisp and refreshing whites for every occasion",
    description: "From buttery Chardonnays to zesty Sauvignon Blancs, find your perfect white wine companion.",
    imageUrl: "/images/wines/hero2.jpeg"
  },
  {
    id: 3,
    title: "Rare Vintage Collection",
    subtitle: "Limited edition wines from exceptional years",
    description: "Explore our curated selection of rare vintages, each bottle tells a story of exceptional terroir and craftsmanship.",
    imageUrl: "/images/wines/hero3.jpeg"
  },
  {
    id: 4,
    title: "Artisan Sparkling Wines",
    subtitle: "Celebrate with our handcrafted bubbles",
    description: "From traditional méthode champenoise to modern sparkling techniques, raise a glass to life's special moments.",
    imageUrl: "/images/wines/hero4.jpeg"
  }
];

// Function to fetch carousel data from API
export async function getCarouselData(): Promise<CarouselSlide[]> {
  try {
    const response = await fetch('/api/carousel', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch carousel data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching carousel data:', error);
    return defaultCarouselData;
  }
}

// Function to fetch carousel data directly from database (for API route)
export async function getCarouselDataFromDB(): Promise<CarouselSlide[]> {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Fetch featured wines from database
    const featuredWines = await prisma.wine.findMany({
      where: {
        featured: true,
      },
      include: {
        images: true,
        region: true,
      },
      take: 8, // Limit to 8 featured wines for carousel
    });

    // Transform database wines to carousel slides with enhanced descriptions
    const carouselSlides: CarouselSlide[] = featuredWines.map((wine, index) => {
      // Create rich, detailed descriptions based on wine properties
      let description = wine.elaborate;
      
      if (!description) {
        // Build a rich description from wine properties
        const bodyText = wine.body ? `with a ${wine.body} body` : '';
        const acidityText = wine.acidity ? `and ${wine.acidity} acidity` : '';
        const harmonizeText = wine.harmonize ? `Perfect for ${wine.harmonize}` : '';
        const regionText = wine.region ? `from the renowned ${wine.region.name} region` : '';
        
        description = `Experience the exceptional ${wine.name}, a premium ${wine.type} ${regionText} ${bodyText} ${acidityText}. ${harmonizeText}. This carefully curated selection represents the finest in our collection, showcasing exceptional craftsmanship and terroir expression.`;
      }

      // Enhance the description with additional details
      const enhancedDescription = description.length > 200 
        ? description 
        : `${description} Each bottle tells a story of exceptional winemaking tradition, offering a unique tasting experience that captures the essence of its origin.`;

      return {
        id: wine.id,
        title: wine.name,
        subtitle: `${wine.type} from ${wine.region.name}`,
        description: enhancedDescription,
        imageUrl: wine.images[0]?.url || wine.image || `/images/wines/hero${(index % 4) + 1}.jpeg`,
        wineId: wine.id
      };
    });

    await prisma.$disconnect();
    
    // If no featured wines, return default data
    if (carouselSlides.length === 0) {
      return defaultCarouselData;
    }

    return carouselSlides;
  } catch (error) {
    console.error('Error fetching carousel data from DB:', error);
    return defaultCarouselData;
  }
} 