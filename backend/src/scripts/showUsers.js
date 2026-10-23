require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');
const User = require('../models/User');

const displayUsers = async () => {
  try {
    await connectDatabase();
    const users = await User.find({}, 'customId name email role companyName verified createdAt').lean();
    console.log('\n================ LIVE MONGODB USERS IN ATLAS (reversely.users) ================');
    console.table(
      users.map((u) => ({
        ID: u.customId || u._id.toString().slice(-6),
        Name: u.name,
        Email: u.email,
        Role: u.role.toUpperCase(),
        Company: u.companyName || '-',
        Verified: u.verified ? 'YES' : 'NO',
        Created: u.createdAt ? new Date(u.createdAt).toLocaleString() : 'Seeded',
      }))
    );
    console.log(`Total users in MongoDB Atlas: ${users.length}\n`);
    process.exit(0);
  } catch (err) {
    console.error('Error fetching users from Atlas:', err.message);
    process.exit(1);
  }
};

displayUsers();
