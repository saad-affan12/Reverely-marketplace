const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { search, category, vendorId } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'all' && category !== 'All Categories') {
      filter.category = new RegExp(category, 'i');
    }

    if (vendorId) {
      filter.vendorId = vendorId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { customId: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products.map((p) => p.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      data: product.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { title, category, price, stock, imageUrl, description } = req.body;

    if (!title || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and price are required.',
      });
    }

    const customId = `PRD-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = await Product.create({
      customId,
      vendorId: req.user.id,
      vendorName: req.user.companyName || req.user.name,
      title: title.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400',
      description: description || '',
      rating: 4.8,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (req.user.role !== 'admin' && product.vendorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own products.',
      });
    }

    const allowed = ['title', 'category', 'price', 'stock', 'imageUrl', 'description'];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: product.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (req.user.role !== 'admin' && product.vendorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own products.',
      });
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully.',
      data: product.customId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
