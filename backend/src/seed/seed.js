require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');
const seedData = require('./seedData.json');

const User = require('../models/User');
const Category = require('../models/Category');
const Requirement = require('../models/Requirement');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');

const seedDatabase = async () => {
  console.log('[Seed] Starting database seed process...');

  try {
    // 1. Clear existing records safely
    await User.deleteMany({});
    await Category.deleteMany({});
    await Requirement.deleteMany({});
    await Offer.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log('[Seed] Existing collections cleared.');

    // 2. Insert Categories
    await Category.insertMany(seedData.categories);
    console.log(`[Seed] Seeded ${seedData.categories.length} categories.`);

    // 3. Hash passwords and insert Users
    const usersWithHashedPasswords = await Promise.all(
      seedData.users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(u.password || 'password123', salt);
        return {
          customId: u.customId,
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          companyName: u.companyName || '',
          avatar: u.avatar,
          verified: u.verified !== undefined ? u.verified : true,
          location: u.location || '',
          isActive: true,
        };
      })
    );
    await User.insertMany(usersWithHashedPasswords);
    console.log(`[Seed] Seeded ${usersWithHashedPasswords.length} users with hashed credentials.`);

    // 4. Insert Requirements
    await Requirement.insertMany(seedData.requirements);
    console.log(`[Seed] Seeded ${seedData.requirements.length} requirements.`);

    // 5. Insert Offers
    await Offer.insertMany(seedData.offers);
    console.log(`[Seed] Seeded ${seedData.offers.length} offers.`);

    // 6. Insert Orders
    await Order.insertMany(seedData.orders);
    console.log(`[Seed] Seeded ${seedData.orders.length} orders.`);

    // 7. Insert Products
    await Product.insertMany(seedData.products);
    console.log(`[Seed] Seeded ${seedData.products.length} products.`);

    console.log('[Seed] Database seeding completed successfully! All entities connected.');
    return true;
  } catch (error) {
    console.error('[Seed] Error during database seeding:', error);
    throw error;
  }
};

// If run directly from terminal
if (require.main === module) {
  connectDatabase()
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Fatal error:', err.message);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
