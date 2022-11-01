const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    cabang: {
      type: String,
      required: true,
      default: "Jakarta",
    },
    nama_produk: {
      type: String,
      required: true,
    },
    photo_path: [],
    harga: {
      type: Number,
      required: true,
    },
    status_produk: {
      type: String,
      default: "Aktif",
    },
    tanggal_mulai: { 
      type: String, 
      required: true 
    },
    tanggal_selesai: { 
      type: String, 
      required: true 
    },
    waktu_mulai: { type: String, required: true },
    waktu_selesai: { type: String, required: true },
    status_lelang: {
      type: String,
      default: "Tidak Aktif",
    },
    favorites: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
    bids: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        nominal_bid: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Product = mongoose.model("product", ProductSchema);
