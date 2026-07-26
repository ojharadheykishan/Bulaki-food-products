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
      name: 'Bulaki Special Bikaneri Bhujia',
      category: 'Bhujia',
      description: 'Authentic Bikaneri bhujia made with moth dal flour and traditional spices. Crispy, spicy, and perfectly seasoned.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400'],
      variants: [
        { weight: '200g', price: 60, mrp: 70, stock: 100 },
        { weight: '400g', price: 120, mrp: 140, stock: 80 },
        { weight: '1kg', price: 280, mrp: 320, stock: 50 },
      ],
      ingredients: ['Moth Dal Flour', 'Gram Flour', 'Edible Oil', 'Red Chilli', 'Salt', 'Spices'],
      shelfLife: '6 Months',
      nutritionalInfo: { energy: '520 kcal/100g', protein: '12g', fat: '24g', carbs: '65g' },
      ratings: 4.9,
      reviewCount: 1240,
      isBestseller: true,
    },
    {
      name: 'Traditional Rasgulla',
      category: 'Sweets',
      description: 'Soft, spongy cottage cheese balls soaked in light sugar syrup. A classic Bengali sweet.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400'],
      variants: [
        { weight: '500g', price: 180, mrp: 200, stock: 40 },
        { weight: '1kg', price: 350, mrp: 390, stock: 25 },
      ],
      ingredients: ['Milk', 'Sugar', 'Cardamom', 'Rose Water'],
      shelfLife: '3 Months',
      nutritionalInfo: { energy: '180 kcal/100g', protein: '6g', fat: '4g', carbs: '32g' },
      ratings: 4.8,
      reviewCount: 890,
      isBestseller: true,
    },
    {
      name: 'Soan Papdi',
      category: 'Sweets',
      description: 'Flaky, sweet gram flour dessert with cardamom flavor. Melts in your mouth.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400'],
      variants: [
        { weight: '250g', price: 90, mrp: 110, stock: 60 },
        { weight: '500g', price: 170, mrp: 200, stock: 45 },
        { weight: '1kg', price: 320, mrp: 380, stock: 30 },
      ],
      ingredients: ['Gram Flour', 'Sugar', 'Ghee', 'Cardamom', 'Nuts'],
      shelfLife: '3 Months',
      nutritionalInfo: { energy: '450 kcal/100g', protein: '5g', fat: '14g', carbs: '78g' },
      ratings: 4.6,
      reviewCount: 560,
      isBestseller: false,
    },
    {
      name: 'Dal Moth',
      category: 'Namkeen',
      description: 'Crunchy fried lentil snack with tangy spices. Perfect tea-time companion.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'],
      variants: [
        { weight: '200g', price: 55, mrp: 65, stock: 120 },
        { weight: '400g', price: 105, mrp: 120, stock: 90 },
        { weight: '1kg', price: 240, mrp: 280, stock: 60 },
      ],
      ingredients: ['Moth Dal', 'Edible Oil', 'Salt', 'Spices', 'Lemon Powder'],
      shelfLife: '6 Months',
      nutritionalInfo: { energy: '480 kcal/100g', protein: '18g', fat: '20g', carbs: '58g' },
      ratings: 4.5,
      reviewCount: 430,
      isBestseller: true,
    },
    {
      name: 'Besan Ki Boondi',
      category: 'Namkeen',
      description: 'Crispy gram flour pearls spiced with cumin and black pepper. A savory snack.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1599909533681-74084efc65f7?w=400'],
      variants: [
        { weight: '250g', price: 70, mrp: 80, stock: 80 },
        { weight: '500g', price: 130, mrp: 150, stock: 55 },
      ],
      ingredients: ['Gram Flour', 'Edible Oil', 'Salt', 'Cumin', 'Black Pepper'],
      shelfLife: '6 Months',
      nutritionalInfo: { energy: '510 kcal/100g', protein: '14g', fat: '22g', carbs: '66g' },
      ratings: 4.4,
      reviewCount: 310,
      isBestseller: false,
    },
    {
      name: 'Bikaneri Mathri',
      category: 'Snacks',
      description: 'Traditional flaky, crispy, deep-fried crackers with ajwain and spices.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400'],
      variants: [
        { weight: '200g', price: 65, mrp: 75, stock: 70 },
        { weight: '400g', price: 120, mrp: 140, stock: 50 },
        { weight: '1kg', price: 280, mrp: 320, stock: 35 },
      ],
      ingredients: ['Wheat Flour', 'Semolina', 'Ajwain', 'Edible Oil', 'Salt', 'Spices'],
      shelfLife: '6 Months',
      nutritionalInfo: { energy: '540 kcal/100g', protein: '10g', fat: '26g', carbs: '64g' },
      ratings: 4.7,
      reviewCount: 670,
      isBestseller: true,
    },
    {
      name: 'Premium Garam Masala',
      category: 'Spices',
      description: 'Aromatic blend of roasted spices for authentic Indian curries and gravies.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1599909533681-74084efc65f7?w=400'],
      variants: [
        { weight: '100g', price: 85, mrp: 100, stock: 150 },
        { weight: '250g', price: 190, mrp: 220, stock: 100 },
      ],
      ingredients: ['Cinnamon', 'Cloves', 'Cardamom', 'Cumin', 'Black Pepper', 'Bay Leaf'],
      shelfLife: '12 Months',
      nutritionalInfo: { energy: '380 kcal/100g', protein: '12g', fat: '14g', carbs: '54g' },
      ratings: 4.6,
      reviewCount: 220,
      isBestseller: false,
    },
    {
      name: 'Gulab Jamun',
      category: 'Sweets',
      description: 'Soft milk-solid dumplings soaked in rose and cardamom flavored sugar syrup.',
      isVeg: true,
      images: ['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400'],
      variants: [
        { weight: '500g', price: 160, mrp: 180, stock: 35 },
        { weight: '1kg', price: 300, mrp: 340, stock: 20 },
      ],
      ingredients: ['Milk Solids', 'Sugar', 'Cardamom', 'Rose Water', 'Ghee'],
      shelfLife: '3 Months',
      nutritionalInfo: { energy: '280 kcal/100g', protein: '5g', fat: '12g', carbs: '40g' },
      ratings: 4.9,
      reviewCount: 980,
      isBestseller: true,
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
      role: 'ADMIN',
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
