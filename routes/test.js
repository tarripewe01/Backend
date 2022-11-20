const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const TestModel = require("../models/Test");
const UserModel = require("../models/User");
const upload = require("../middleware/upload");

const { isValidObjectId } = require("mongoose");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

// @route   POST api/product
// @desc    Create a Product
// @access  Private
router.post("/", upload.single("avatar"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nama_produk, harga } = req.body;
  const { file } = req;

  const newProduct = new TestModel({
    harga,
    nama_produk,
  });

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 480, width: 640, crop: "thumb" }
    );

    newProduct.avatar = { url: secure_url, public_id };
  }

  await newProduct.save();

  res.status(201).json({
    id: newProduct._id,
    harga,
    nama_produk,
    avatar: newProduct.avatar?.url,
  });
});

module.exports = router;
