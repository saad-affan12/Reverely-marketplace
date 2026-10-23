require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');

const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const Category = require('../models/Category');

const target = process.argv[2] || 'all';

const run = async () => {
  try {
    await connectDatabase();

    if (target === 'users' || target === 'all') {
      const users = await User.find({}, 'customId name email role companyName verified').lean();
      console.log('\n================ 👤 MONGODB USERS (reversely.users) ================');
      console.table(
        users.map((u) => ({
          ID: u.customId || u._id.toString().slice(-6),
          Name: u.name,
          Email: u.email,
          Role: u.role.toUpperCase(),
          Company: u.companyName || '-',
          Verified: u.verified ? 'YES' : 'NO',
        }))
      );
      console.log(`Total Users: ${users.length}`);
    }

    if (target === 'requirements' || target === 'all') {
      const reqs = await Requirement.find({}, 'customId title category maxBudget minBudget quantity offersCount status customerName').lean();
      console.log('\n================ 📋 MONGODB REQUIREMENTS (reversely.requirements) ================');
      console.table(
        reqs.map((r) => ({
          ID: r.customId || r._id.toString().slice(-6),
          Title: r.title.length > 30 ? r.title.slice(0, 27) + '...' : r.title,
          Category: r.category,
          Buyer: r.customerName,
          Budget: `₹${r.maxBudget}`,
          Qty: r.quantity,
          Bids: r.offersCount || 0,
          Status: r.status.toUpperCase(),
        }))
      );
      console.log(`Total Requirements: ${reqs.length}`);
    }

    if (target === 'offers' || target === 'all') {
      const offers = await Offer.find({}, 'customId requirementId vendorName price deliveryDays status').lean();
      console.log('\n================ 🏷️ MONGODB VENDOR OFFERS (reversely.offers) ================');
      console.table(
        offers.map((o) => ({
          ID: o.customId || o._id.toString().slice(-6),
          ReqID: o.requirementId,
          Vendor: o.vendorName,
          QuotedPrice: `₹${o.price}`,
          Delivery: `${o.deliveryDays} days`,
          Status: o.status.toUpperCase(),
        }))
      );
      console.log(`Total Vendor Offers: ${offers.length}`);
    }

    if (target === 'orders' || target === 'all') {
      const orders = await Order.find({}, 'customId title customerName vendorName totalAmount status expectedDeliveryDate').lean();
      console.log('\n================ 📦 MONGODB ORDERS (reversely.orders) ================');
      console.table(
        orders.map((ord) => ({
          ID: ord.customId || ord._id.toString().slice(-6),
          Title: ord.title ? (ord.title.length > 25 ? ord.title.slice(0, 22) + '...' : ord.title) : '-',
          Buyer: ord.customerName,
          Vendor: ord.vendorName,
          Total: `₹${ord.totalAmount}`,
          Status: ord.status.toUpperCase(),
          EstDelivery: ord.expectedDeliveryDate || '-',
        }))
      );
      console.log(`Total Orders: ${orders.length}`);
    }

    if (target === 'categories' || target === 'all') {
      const cats = await Category.find({}, 'name slug icon').lean();
      console.log('\n================ 🏷️ MONGODB CATEGORIES (reversely.categories) ================');
      console.table(
        cats.map((c) => ({
          Name: c.name,
          Slug: c.slug,
          Icon: c.icon || '-',
        }))
      );
      console.log(`Total Categories: ${cats.length}`);
    }

    console.log('\n✅ Query completed successfully against MongoDB Atlas!\n');
    process.exit(0);
  } catch (err) {
    console.error('Error fetching data from MongoDB Atlas:', err.message);
    process.exit(1);
  }
};

run();
