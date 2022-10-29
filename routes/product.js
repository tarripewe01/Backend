const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const ProductModel = require("../models/Product");
const UserModel = require("../models/User");

// @route   POST api/product
// @desc    Create a Product
// @access  Private
router.post("/", [auth], async (req, res) => {
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

module.exports = router;
