import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model';

dotenv.config();

const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Accessories', 'Sports', 'Beauty'];

const products = [
    // --- Electronics ---
    {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise cancellation optimized to you. Magnificent Sound, engineered to perfection.',
        price: 26990,
        originalPrice: 34990,
        imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
        category: 'Electronics',
        stock: 120,
        rating: 4.8,
        reviews: 1250,
        featured: true
    },
    {
        name: 'Apple MacBook Pro 16" M3 Max',
        description: 'The most powerful MacBook Pro ever is here. Blazing-fast M3 Max chip, incredible battery life.',
        price: 349900,
        originalPrice: 399900,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
        category: 'Electronics',
        stock: 45,
        rating: 4.9,
        reviews: 89,
        featured: true
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Unleash new levels of creativity and productivity with Galaxy S24 Ultra. Powered by Galaxy AI.',
        price: 129999,
        originalPrice: 134999,
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
        category: 'Electronics',
        stock: 200,
        rating: 4.7,
        reviews: 430,
        featured: true
    },
    {
        name: 'Canon EOS R5 Mirrorless Camera',
        description: 'Professional 45MP full-frame mirrorless camera with 8K video recording and advanced autofocus.',
        price: 339995,
        originalPrice: 389995,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        category: 'Electronics',
        stock: 15,
        rating: 4.9,
        reviews: 120,
        featured: true
    },
    {
        name: 'PlayStation 5 Console',
        description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback.',
        price: 49990,
        originalPrice: 54990,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
        category: 'Electronics',
        stock: 10,
        rating: 4.9,
        reviews: 5000,
        featured: true
    },
    {
        name: 'Dyson V15 Detect Vacuum',
        description: 'Dyson’s most powerful, intelligent cordless vacuum. Laser reveals microscopic dust.',
        price: 65900,
        originalPrice: 69900,
        imageUrl: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 60,
        rating: 4.7,
        reviews: 890,
        featured: true
    },
    {
        name: 'LG C3 OLED Evo 65" TV',
        description: 'The advanced LG OLED evo C-series is better than ever. The α9 AI Processor Gen6 powers incredible picture.',
        price: 169990,
        originalPrice: 249990,
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        category: 'Electronics',
        stock: 25,
        rating: 4.8,
        reviews: 340,
        featured: false
    },
    {
        name: 'Bose QuietComfort Ultra Earbuds',
        description: 'World-class noise cancellation, quieter than ever before. Breakthrough spatialized audio.',
        price: 25900,
        originalPrice: 29900,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        category: 'Electronics',
        stock: 150,
        rating: 4.6,
        reviews: 670,
        featured: false
    },
    {
        name: 'iPad Pro 12.9" M2 Chip',
        description: 'Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity.',
        price: 112900,
        originalPrice: 119900,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        category: 'Electronics',
        stock: 80,
        rating: 4.8,
        reviews: 1100,
        featured: true
    },
    {
        name: 'Logitech MX Master 3S Mouse',
        description: 'An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance.',
        price: 9995,
        originalPrice: 10995,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
        category: 'Electronics',
        stock: 300,
        rating: 4.9,
        reviews: 2500,
        featured: false
    },

    // --- Fashion ---
    {
        name: 'Nike Air Jordan 1 Retro High',
        description: 'A legendary shoe with a timeless design. Premium leather materials and iconic Air-Sole unit.',
        price: 16995,
        originalPrice: 19995,
        imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
        category: 'Fashion',
        stock: 12,
        rating: 4.8,
        reviews: 3200,
        featured: true
    },
    {
        name: 'Ray-Ban Aviator Classic',
        description: 'Currently one of the most iconic sunglass models in the world. Timeless design with exceptional quality.',
        price: 9590,
        originalPrice: 11590,
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        category: 'Fashion',
        stock: 90,
        rating: 4.7,
        reviews: 1500,
        featured: false
    },
    {
        name: 'Adidas Ultraboost Light',
        description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.',
        price: 14999,
        originalPrice: 17999,
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
        category: 'Fashion',
        stock: 65,
        rating: 4.6,
        reviews: 890,
        featured: false
    },
    {
        name: 'Levi\'s 501 Original Fit Jeans',
        description: 'The blue jean that started it all. Our 501 Original Fit Jeans have been worn by generations.',
        price: 2999,
        originalPrice: 4599,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
        category: 'Fashion',
        stock: 200,
        rating: 4.5,
        reviews: 4500,
        featured: false
    },
    {
        name: 'North Face McMurdo Parka',
        description: 'Meet the McMurdo Parka, an all-around coat that meets the specific needs of commuting in the cold.',
        price: 32999,
        originalPrice: 38999,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
        category: 'Fashion',
        stock: 40,
        rating: 4.8,
        reviews: 600,
        featured: true
    },
    {
        name: 'Gucci Leather Belt',
        description: 'A signature emblem of the House, the Double G hardware is presented on a black leather belt.',
        price: 45500,
        originalPrice: 52000,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        category: 'Fashion',
        stock: 20,
        rating: 4.9,
        reviews: 120,
        featured: false
    },
    {
        name: 'Rolex Submariner Date',
        description: 'The archetype of the diver\'s watch. The Oyster Perpetual Submariner Date in Oystersteel.',
        price: 985000,
        originalPrice: 1150000,
        imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
        category: 'Accessories',
        stock: 5,
        rating: 5.0,
        reviews: 45,
        featured: true
    },
    {
        name: 'Lululemon Align High-Rise Pant',
        description: 'Powered by Nulu™ fabric, these pants feel weightless and buttery soft.',
        price: 8900,
        originalPrice: 9900,
        imageUrl: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&q=80',
        category: 'Fashion',
        stock: 150,
        rating: 4.8,
        reviews: 8000,
        featured: false
    },
    {
        name: 'Timberland Premium 6-Inch Boot',
        description: 'The original waterproof boot that helped start it all in 1973. Instantly recognizable.',
        price: 16990,
        originalPrice: 18990,
        imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80',
        category: 'Fashion',
        stock: 80,
        rating: 4.7,
        reviews: 2100,
        featured: false
    },
    {
        name: 'Herschel Little America Backpack',
        description: 'An iconic mountaineering style available in a wide variety of colors and prints.',
        price: 8999,
        originalPrice: 10999,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        category: 'Accessories',
        stock: 110,
        rating: 4.6,
        reviews: 1400,
        featured: false
    },

    // --- Home & Kitchen ---
    {
        name: 'Herman Miller Aeron Chair',
        description: 'The Aeron Chair combines a deep knowledge of human-centered design with cutting-edge technology.',
        price: 135000,
        originalPrice: 165000,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 30,
        rating: 4.9,
        reviews: 210,
        featured: true
    },
    {
        name: 'Nespresso Vertuo Coffee Machine',
        description: 'Nespresso Vertuo offers a full range of coffee styles with its unique Centrifusion technology.',
        price: 19990,
        originalPrice: 24990,
        imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 85,
        rating: 4.6,
        reviews: 1540,
        featured: false
    },
    {
        name: 'KitchenAid Artisan Series Mixer',
        description: 'Make up to 9 dozen cookies in a single batch with the KitchenAid Artisan Series 5 Quart Tilt-Head Stand Mixer.',
        price: 42999,
        originalPrice: 49999,
        imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 50,
        rating: 4.9,
        reviews: 5600,
        featured: true
    },
    {
        name: 'Le Creuset Signature Dutch Oven',
        description: 'The iconic Le Creuset Dutch Oven is indispensable in the kitchens of home cooks and professional chefs alike.',
        price: 34500,
        originalPrice: 42000,
        imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 40,
        rating: 4.9,
        reviews: 980,
        featured: false
    },
    {
        name: 'Philips Hue Starter Kit',
        description: 'Add ambient color to any room with the Philips Hue White and Color Ambiance Starter Kit.',
        price: 14999,
        originalPrice: 18999,
        imageUrl: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 120,
        rating: 4.5,
        reviews: 890,
        featured: false
    },
    {
        name: 'Yeti Rambler 20 oz Tumbler',
        description: 'Any tumbler that\'s coming along for the ride needs to be tough enough to keep up.',
        price: 3200,
        originalPrice: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 500,
        rating: 4.8,
        reviews: 12000,
        featured: false
    },
    {
        name: 'Breville Barista Express',
        description: 'Create third wave specialty coffee at home with ease. Integrated grinder for bean-to-cup in under a minute.',
        price: 64990,
        originalPrice: 72990,
        imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800&q=80',
        category: 'Home & Kitchen',
        stock: 25,
        rating: 4.8,
        reviews: 3200,
        featured: true
    },
    {
        name: 'Sonos Arc Soundbar',
        description: 'Bring all your entertainment to life with the brilliant, realistic sound of Arc, featuring Dolby Atmos.',
        price: 84999,
        originalPrice: 94999,
        imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
        category: 'Electronics',
        stock: 35,
        rating: 4.7,
        reviews: 800,
        featured: false
    },

    // --- Sports & Outdoors ---
    {
        name: 'Peloton Bike+',
        description: 'A cardio workout that moves you. The Peloton Bike+ brings the studio to your home.',
        price: 225000,
        originalPrice: 249000,
        imageUrl: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=800&q=80',
        category: 'Sports',
        stock: 15,
        rating: 4.8,
        reviews: 1500,
        featured: true
    },
    {
        name: 'Wilson NFL Duke Football',
        description: 'The official football of the NFL. Handcrafted in Ada, Ohio.',
        price: 10999,
        originalPrice: 12999,
        imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
        category: 'Sports',
        stock: 200,
        rating: 4.9,
        reviews: 450,
        featured: false
    },
    {
        name: 'Manduka PRO Yoga Mat',
        description: 'An ultra-dense and spacious performance yoga mat that has unmatched comfort and cushioning.',
        price: 11500,
        originalPrice: 13500,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
        category: 'Sports',
        stock: 100,
        rating: 4.7,
        reviews: 2100,
        featured: false
    },
    {
        name: 'Yeti Tundra 45 Cooler',
        description: 'Combines durability with ample versatility. Built to withstand everything perfectly.',
        price: 28900,
        originalPrice: 32900,
        imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
        category: 'Sports',
        stock: 45,
        rating: 4.9,
        reviews: 5600,
        featured: false
    },

    // --- Beauty ---
    {
        name: 'Dyson Airwrap Multi-Styler',
        description: 'Curl. Shape. Smooth and hide flyaways. With no extreme heat.',
        price: 45900,
        originalPrice: 49900,
        imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80',
        category: 'Beauty',
        stock: 40,
        rating: 4.6,
        reviews: 4500,
        featured: true
    },
    {
        name: 'Chanel No. 5 Eau de Parfum',
        description: 'A powdery floral bouquet. A timeless, legendary fragrance.',
        price: 14500,
        originalPrice: 16500,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        category: 'Beauty',
        stock: 80,
        rating: 4.8,
        reviews: 2100,
        featured: false
    },
    {
        name: 'La Mer Crème de la Mer',
        description: 'The moisturizer that started it all. Immerse your skin in moisture with this luxuriously rich cream.',
        price: 32900,
        originalPrice: 38000,
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        category: 'Beauty',
        stock: 30,
        rating: 4.7,
        reviews: 900,
        featured: false
    },
    {
        name: 'Apple iPhone 15 Pro Max',
        description: 'Titanium design. A17 Pro chip. The longest optical zoom in iPhone ever. Mobile Phone.',
        price: 159900,
        originalPrice: 165900,
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        category: 'Electronics',
        stock: 50,
        rating: 4.9,
        reviews: 2100,
        featured: true
    },
    {
        name: 'Google Pixel 8 Pro',
        description: 'The AI-powered phone from Google. Pro-level cameras and all-day battery.',
        price: 106999,
        originalPrice: 116999,
        imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80',
        category: 'Electronics',
        stock: 45,
        rating: 4.7,
        reviews: 850,
        featured: true
    },
    {
        name: 'OnePlus 12',
        description: 'Smooth beyond belief. Snapdragon 8 Gen 3. The best display on a smartphone.',
        price: 64999,
        originalPrice: 69999,
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
        category: 'Electronics',
        stock: 30,
        rating: 4.6,
        reviews: 320,
        featured: false
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartifyx');
        console.log('MongoDB Connected for Seeding');

        await Product.deleteMany({});
        console.log('Existing products cleared');

        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products!`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

seedDB();
