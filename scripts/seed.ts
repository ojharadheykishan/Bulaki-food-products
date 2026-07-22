import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bulaki_food_products';

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const demoProducts = [
    {
      name: 'Organic Turmeric Powder',
      category: 'Spices',
      price: 149,
      discountPrice: 129,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'],
      description: 'Premium organic turmeric powder sourced from the finest farms. Rich in curcumin with vibrant color and authentic aroma.',
      isFood: true,
      isVeg: true,
      ingredients: ['Turmeric', 'Natural Color'],
      shelfLife: '12 months',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
      ratings: 4.5,
      reviewCount: 128,
      weight: '100g',
      brand: 'Bulaki',
    },
    {
      name: 'Premium Basmati Rice',
      category: 'Food',
      price: 299,
      discountPrice: 249,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
      description: 'Aged premium basmati rice with long grains and authentic aroma. Perfect for biryani and pulao.',
      isFood: true,
      isVeg: true,
      ingredients: ['Aged Basmati Rice'],
      shelfLife: '24 months',
      storageInstructions: 'Store in airtight container in a cool, dry place.',
      ratings: 4.8,
      reviewCount: 245,
      weight: '1kg',
      brand: 'Bulaki',
    },
    {
      name: 'Mixed Dry Fruits Pack',
      category: 'Snacks',
      price: 499,
      discountPrice: 449,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400'],
      description: 'Premium mix of almonds, cashews, raisins, and walnuts. Perfect for healthy snacking.',
      isFood: true,
      isVeg: true,
      ingredients: ['Almonds', 'Cashews', 'Raisins', 'Walnuts', 'Pistachios'],
      shelfLife: '6 months',
      storageInstructions: 'Store in refrigerator for longer freshness.',
      ratings: 4.7,
      reviewCount: 89,
      weight: '500g',
      brand: 'Bulaki',
    },
    {
      name: 'Red Chilli Powder',
      category: 'Spices',
      price: 89,
      discountPrice: 79,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1588179460426-76d6d94b6c8c?w=400'],
      description: 'Finely ground red chilli powder with authentic heat and rich color. Essential for Indian cooking.',
      isFood: true,
      isVeg: true,
      ingredients: ['Red Chili Peppers'],
      shelfLife: '18 months',
      storageInstructions: 'Store in a cool, dry place.',
      ratings: 4.3,
      reviewCount: 156,
      weight: '250g',
      brand: 'Bulaki',
    },
    {
      name: 'Masala Chips',
      category: 'Snacks',
      price: 39,
      stock: 500,
      images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'],
      description: 'Crunchy masala chips with the perfect blend of Indian spices. A tasty snack for any time.',
      isFood: true,
      isVeg: true,
      ingredients: ['Potato', 'Edible Oil', 'Spices', 'Salt'],
      shelfLife: '6 months',
      storageInstructions: 'Store in a cool, dry place. Seal after opening.',
      ratings: 4.4,
      reviewCount: 312,
      weight: '150g',
      brand: 'Bulaki',
    },
    {
      name: 'Mustard Seeds',
      category: 'Spices',
      price: 59,
      discountPrice: 49,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1599909533681-74084efc65f7?w=400'],
      description: 'Pure yellow mustard seeds with pungent aroma. Essential for tadka and pickles.',
      isFood: true,
      isVeg: true,
      ingredients: ['Mustard Seeds'],
      shelfLife: '18 months',
      storageInstructions: 'Store in a cool, dry place in an airtight container.',
      ratings: 4.2,
      reviewCount: 67,
      weight: '200g',
      brand: 'Bulaki',
    },
    {
      name: 'Cotton Tote Bag',
      category: 'General Product',
      price: 199,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1597484661973-8d2c2c6f5ffb?w=400'],
      description: 'Durable and eco-friendly cotton tote bag. Perfect for shopping and daily use.',
      isFood: false,
      isVeg: true,
      ratings: 4.6,
      reviewCount: 45,
      weight: '300g',
      brand: 'Bulaki',
    },
    {
      name: 'Kitchen Storage Container Set',
      category: 'General Product',
      price: 399,
      discountPrice: 349,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400'],
      description: 'Set of 4 airtight storage containers in different sizes. BPA-free and microwave safe.',
      isFood: false,
      isVeg: true,
      ratings: 4.5,
      reviewCount: 78,
      weight: '1kg',
      brand: 'Bulaki',
    },
  ];

  for (const product of demoProducts) {
    const slug = product.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    await Product.findOneAndUpdate({ slug }, product, { upsert: true, new: true });
    console.log(`Created product: ${product.name}`);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.findOneAndUpdate(
    { email: 'admin@bulaki.com' },
    {
      name: 'Admin',
      email: 'admin@bulaki.com',
      password: hashedPassword,
      role: 'admin',
      verified: true,
    },
    { upsert: true, new: true }
  );
  console.log('Created admin user: admin@bulaki.com / admin123');

  await mongoose.disconnect();
  console.log('Seeder completed!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
