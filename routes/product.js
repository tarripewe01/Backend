const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const ProductModel = require("../models/Product");
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

  const {
    cabang,
    nama_produk,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
  } = req.body;
  const { file } = req;

  const newProduct = new ProductModel({
    cabang,
    harga,
    nama_produk,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
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
    cabang,
    harga,
    nama_produk,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
    avatar: newProduct.avatar?.url,
  });
});

// @route   POST api/product
// @desc    Create a Product
// @access  Private
router.put("/:productId", upload.single("avatar"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    cabang,
    nama_produk,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
  } = req.body;
  const { file } = req;
  const { productId } = req.params;

  if (!isValidObjectId(productId)) return sendError(res, "Invalid Request");

  const product = await ProductModel.findById(productId);
  if (!product) return sendError(res, "Product not found");

  const public_id = product.avatar?.public_id;

  // remove old Image
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud");
  }

  // upload new image
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 480, width: 640, crop: "thumb" }
    );

    product.avatar = { url: secure_url, public_id };
  }

  product.no_lot = no_lot;
  product.cabang = cabang;
  product.nama_produk = nama_produk;
  product.harga = harga;
  product.kategori = kategori;
  product.tanggal_mulai = tanggal_mulai;
  product.tanggal_selesai = tanggal_selesai;
  product.kondisi_mesin = kondisi_mesin;
  product.kondisi_exterior = kondisi_exterior;
  product.kondisi_interior = kondisi_interior;
  product.merk_produk = merk_produk;
  product.model_produk = model_produk;
  product.tahun_produk = tahun_produk;
  product.transmisi = transmisi;
  product.no_rangka = no_rangka;
  product.no_mesin = no_mesin;
  product.kapasitas_mesin = kapasitas_mesin;
  product.odometer = odometer;
  product.catatan = catatan;
  product.no_polisi = no_polisi;
  product.warna = warna;
  product.stnk = stnk;
  product.exp_stnk = exp_stnk;
  product.faktur = faktur;
  product.ktp = ktp;
  product.kwitansi = kwitansi;
  product.form_A = form_A;
  product.sph = sph;
  product.keur = keur;
  product.bpkb = bpkb;
  product.waktu_mulai = waktu_mulai;
  product.waktu_selesai = waktu_selesai;
  product.status_produk = status_produk;

  await product.save();

  res.status(201).json({
    id: product._id,
    cabang,
    harga,
    nama_produk,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
    avatar: product.avatar?.url,
  });
});

// @route   GET api/product
// @desc    Get all Products
// @access  Public
router.get("/", async (req, res) => {
  const result = await ProductModel.find().sort({ createdAt: -1 }).limit(10);

  res.status(200).json(result);
});

// @route   GET api/product/filter?kategori=Mobil&status=Aktif
// @desc    Get all Products Filter
// @access  Public
router.get("/filter", async (req, res) => {
  const { kategori, status } = req.query;
  try {
    if (kategori && !status) {
      const data = await ProductModel.find({ kategori: kategori });
      return res.send(data);
    } else if (!kategori && status) {
      const data = await ProductModel.find({ status_produk: status });
      return res.send(data);
    } else {
      const data = await ProductModel.find({
        status_produk: status,
        kategori: kategori,
      });
      return res.send(data);
    }
  } catch (error) {}
});

// @route   GET api/product/filter/lelang?kategori=Mobil&status=Aktif
// @desc    Get all Lelang Filter
// @access  Public
router.get("/filter/lelang", async (req, res) => {
  const { kategori, status } = req.query;
  try {
    if (kategori && !status) {
      const data = await ProductModel.find({ kategori: kategori });
      return res.send(data);
    } else if (!kategori && status) {
      const data = await ProductModel.find({ status_lelang: status });
      return res.send(data);
    } else {
      const data = await ProductModel.find({
        status_lelang: status,
        kategori: kategori,
      });
      return res.send(data);
    }
  } catch (error) {}
});

// @route   GET api/product/:id
// @desc    GET Product by ID
// @access  Private
router.get("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
router.put("/favorite/:id", async (req, res) => {
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

    product.favorites.unshift({ user: req.user.id, status: false });

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
      const { id } = req.params;
      const { nominal_bid } = req.body;

      const user = await UserModel.findById(req.user.id).select("-password");
      const product = await ProductModel.findById(id);

      const newBid = {
        nominal_bid,
        user,
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

module.exports = router;
