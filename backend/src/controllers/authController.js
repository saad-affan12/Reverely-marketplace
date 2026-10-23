const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super_secret_reversely_jwt_key_2026_dev';
  return jwt.sign(
    {
      id: user.customId || user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator accounts cannot be created via public registration.',
      });
    }

    const assignedRole = role === 'vendor' ? 'vendor' : 'customer';

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const customId = `usr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

    const newUser = await User.create({
      customId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: assignedRole,
      companyName: companyName || '',
      location: location || '',
      verified: assignedRole === 'customer',
      isActive: true,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: newUser.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account is registered as ${user.role}, not ${role}.`,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ customId: req.user.id }, { _id: req.user._id }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/demo-login
const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body;
    const targetRole = ['customer', 'vendor', 'admin'].includes(role) ? role : 'customer';

    let user = await User.findOne({ role: targetRole });

    if (!user) {
      // Auto-create demo user if not present
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);
      user = await User.create({
        customId: `demo-${targetRole}`,
        name: targetRole === 'customer' ? 'Saad Ahmed' : targetRole === 'vendor' ? 'PrintHub Solutions' : 'Admin Supervisor',
        email: `${targetRole}@example.com`,
        passwordHash,
        role: targetRole,
        companyName: targetRole === 'vendor' ? 'PrintHub Pvt Ltd' : 'Apex Innovations',
        verified: true,
        isActive: true,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Logged in as demo ${targetRole}.`,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin,
};
