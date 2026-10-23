require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');

const User = require('../models/User');
const Requirement = require('../models/Requirement');
const Offer = require('../models/Offer');
const Order = require('../models/Order');
const Category = require('../models/Category');

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';
const param = args[1] ? args[1].toLowerCase() : '';

const getDateFilter = (dateStr) => {
  let date;
  if (!dateStr || dateStr === 'today') {
    date = new Date();
  } else {
    date = new Date(dateStr);
  }
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

const run = async () => {
  try {
    await connectDatabase();

    // 1. STATS COMMAND
    if (command === 'stats') {
      const [users, reqs, offers, orders, categories] = await Promise.all([
        User.countDocuments(),
        Requirement.countDocuments(),
        Offer.countDocuments(),
        Order.countDocuments(),
        Category.countDocuments(),
      ]);

      console.log('\n================ 📊 MONGODB ATLAS DATABASE SUMMARY ================');
      console.table([
        { Collection: 'users', Documents: users, Description: 'Registered Buyers, Vendors & Admins' },
        { Collection: 'requirements', Documents: reqs, Description: 'Buyer RFPs & Demands' },
        { Collection: 'offers', Documents: offers, Description: 'Vendor Bids & Quotations' },
        { Collection: 'orders', Documents: orders, Description: '6-Stage Fulfillment Orders' },
        { Collection: 'categories', Documents: categories, Description: 'Active Marketplace Categories' },
      ]);
      console.log(`Connected Cluster: ${mongoose.connection.host}`);
      console.log(`Database Name:     ${mongoose.connection.name}\n`);
      process.exit(0);
    }

    // 2. DATE FILTER COMMAND
    if (command === 'date' || command === 'today') {
      const dateTarget = command === 'today' ? 'today' : (param || 'today');
      const dateFilter = getDateFilter(dateTarget);
      const displayDate = dateTarget === 'today' ? new Date().toISOString().split('T')[0] : dateTarget;

      console.log(`\n================ 📅 RECORDS CREATED ON DATE: ${displayDate} ================`);

      const [users, reqs, offers, orders] = await Promise.all([
        User.find({ createdAt: dateFilter }, 'name email role companyName createdAt').lean(),
        Requirement.find({ createdAt: dateFilter }, 'title category customerName maxBudget status createdAt').lean(),
        Offer.find({ createdAt: dateFilter }, 'vendorName price deliveryDays status createdAt').lean(),
        Order.find({ createdAt: dateFilter }, 'title customerName vendorName totalAmount status createdAt').lean(),
      ]);

      console.log(`\n👤 Users Created (${users.length}):`);
      if (users.length > 0) {
        console.table(users.map(u => ({
          Name: u.name,
          Email: u.email,
          Role: u.role.toUpperCase(),
          Company: u.companyName || '-',
          Time: new Date(u.createdAt).toLocaleTimeString(),
        })));
      } else {
        console.log('  No users created on this date.');
      }

      console.log(`\n📋 Requirements Created (${reqs.length}):`);
      if (reqs.length > 0) {
        console.table(reqs.map(r => ({
          Title: r.title,
          Category: r.category,
          Buyer: r.customerName,
          Budget: `₹${r.maxBudget}`,
          Status: r.status.toUpperCase(),
          Time: new Date(r.createdAt).toLocaleTimeString(),
        })));
      } else {
        console.log('  No requirements created on this date.');
      }

      console.log(`\n🏷️ Vendor Offers Submitted (${offers.length}):`);
      if (offers.length > 0) {
        console.table(offers.map(o => ({
          Vendor: o.vendorName,
          Price: `₹${o.price}`,
          Days: `${o.deliveryDays}d`,
          Status: o.status.toUpperCase(),
          Time: new Date(o.createdAt).toLocaleTimeString(),
        })));
      } else {
        console.log('  No offers submitted on this date.');
      }

      console.log(`\n📦 Orders Created (${orders.length}):`);
      if (orders.length > 0) {
        console.table(orders.map(ord => ({
          Title: ord.title,
          Buyer: ord.customerName,
          Vendor: ord.vendorName,
          Total: `₹${ord.totalAmount}`,
          Status: ord.status.toUpperCase(),
          Time: new Date(ord.createdAt).toLocaleTimeString(),
        })));
      } else {
        console.log('  No orders created on this date.');
      }

      console.log(`\n✅ Query for date [${displayDate}] completed!\n`);
      process.exit(0);
    }

    // 3. ROLE FILTER COMMAND
    if (command === 'role') {
      const targetRole = param || 'customer';
      const users = await User.find({ role: targetRole }, 'name email role companyName verified createdAt').lean();
      console.log(`\n================ 👥 USERS WITH ROLE: ${targetRole.toUpperCase()} (${users.length}) ================`);
      console.table(users.map(u => ({
        Name: u.name,
        Email: u.email,
        Company: u.companyName || '-',
        Verified: u.verified ? 'YES' : 'NO',
        Created: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Seeded',
      })));
      console.log('');
      process.exit(0);
    }

    // 4. STATUS FILTER COMMAND
    if (command === 'status') {
      const targetStatus = param || 'open';
      const reqs = await Requirement.find({ status: targetStatus }, 'title category customerName maxBudget offersCount status').lean();
      console.log(`\n================ 📋 REQUIREMENTS WITH STATUS: ${targetStatus.toUpperCase()} (${reqs.length}) ================`);
      console.table(reqs.map(r => ({
        Title: r.title.length > 30 ? r.title.slice(0, 27) + '...' : r.title,
        Category: r.category,
        Buyer: r.customerName,
        Budget: `₹${r.maxBudget}`,
        Bids: r.offersCount || 0,
        Status: r.status.toUpperCase(),
      })));
      console.log('');
      process.exit(0);
    }

    // Default / Help
    console.log(`
Usage:
  npm run db:stats                   Show collection counts & cluster health
  npm run db:today                   Show all records created today
  npm run db:date <YYYY-MM-DD>       Show all records created on a specific date (e.g. 2026-10-23)
  npm run db:role <customer|vendor>  Filter users by role
  npm run db:status <open|fulfilled> Filter requirements by status
`);
    process.exit(0);
  } catch (err) {
    console.error('Database query error:', err.message);
    process.exit(1);
  }
};

run();
