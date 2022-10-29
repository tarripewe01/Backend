const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const ProductModel = require("../models/Product");
const UserModel = require("../models/User");

// @route   POST api/product
// @desc    Create a Product
// @access  Private
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    const { nama_produk, harga, cabang } = req.body;

    const newProduct = new ProductModel({
      nama_produk,
      harga,
      cabang,
      user: req.user.id,
    });

    const product = await newProduct.save();

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/product
// @desc    Get all Products
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

// @route   GET api/product/:id
// @desc    GET Product by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(500).send("Server Error");
  }
})

// @route   DELETE api/product/:id
// @desc    Delete Products
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check user
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await product.remove();

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
})

// @route   PUT api/product/favorite/:id
// @desc    Like a Product
// @access  Private
router.put("/favorite/:id", auth, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    // Check if the product has already been liked
    if (
      product.favorites.filter(favorite => favorite.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Product already liked" });
    }

    product.favorites.unshift({ user: req.user.id });

    await product.save();

    res.json(product.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;
