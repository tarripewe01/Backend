const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const ProductModel = require("../models/Product");
const UserModel = require("../models/User");
const upload = require("../middleware/upload")


// @route   POST api/product
// @desc    Create a Product
// @access  Private
router.post("/", auth, upload.any("photo_path") ,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    const { nama_produk, harga, cabang,  tanggal_mulai,
      tanggal_selesai } = req.body;

    const newProduct = new ProductModel({
      nama_produk,
      harga,
      cabang,
      tanggal_mulai,
      tanggal_selesai,
      user: req.user.id,
    });
    const product = await newProduct.save();
    if(req.files){
      await Promise.all(
        req.files.map(async (path) => {
          await ProductModel.findByIdAndUpdate(product.id, {
            $push : { photo_path : `/uploads/${path.filename}`}
          }, { new : true })
        })
      )
    }
    const data = await ProductModel.findById(product.id)
    res.json(data);
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
});

//filter product
//localhost:9000/api/product/filter?category=Mobil&satus=Aktif

router.get('/filter', async(req,res) => {
  const {category, status} = req.query
  try {
    if(category && !status){
      const data = await ProductModel.find({ category : category })
      return res.send(data)
    }else if(!category && status){
      const data = await ProductModel.find({ status_lelang : status })
      return res.send(data)
    }else{
      const data = await ProductModel.find({ status_lelang : status, category: category })
      return res.send(data)
    }
  } catch (error) {
    
  }
})

module.exports = router;

module.exports = router;




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
});

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
});

// @route   PUT api/product/favorite/:id
// @desc    Favorite a Product
// @access  Private
router.put("/favorite/:id", auth, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    // Check if the product has already been liked
    if (
      product.favorites.filter(
        (favorite) => favorite.user.toString() === req.user.id
      ).length > 0
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
});

// @route   PUT api/product/unfavorite/:id
// @desc    Unfavorite a Product
// @access  Private
router.put("/unfavorite/:id", auth, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    // Check if the product has already been liked
    if (
      product.favorites.filter(
        (favorite) => favorite.user.toString() === req.user.id
      ).length === 0
    ) {
      return res.status(400).json({ msg: "Product has not yet been liked" });
    }

    // Get remove index
    const removeIndex = product.favorites
      .map((favorite) => favorite.user.toString())
      .indexOf(req.user.id);

    product.favorites.splice(removeIndex, 1);

    await product.save();

    res.json(product.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/product/bid/:id
// @desc    Create Bid a Product
// @access  Private
router.post(
  "/bid/:id",
  auth,
  [check("nominal_bid", "Bid is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await UserModel.findById(req.user.id).select("-password");
      const product = await ProductModel.findById(req.params.id);

      const { nominal_bid } = req.body;

      const newBid = {
        nominal_bid,
        user: req.user.id,
      };

      product.bids.unshift(newBid);

      await product.save();

      res.json(product.bids);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);



