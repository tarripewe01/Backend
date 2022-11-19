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
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    harga: {
      type: Number,
      required: true,
    },
    kategori: {
      type: String,
      require: true,
    },
    status_produk: {
      type: String,
      default: "Aktif",
    },
    tanggal_mulai: {
      type: String,
      required: true,
    },
    tanggal_selesai: {
      type: String,
      required: true,
    },
    no_lot: {
      type: Number,
      required: true,
    },
    kondisi_mesin: {
      type: String,
      required: true,
    },
    kondisi_exterior: {
      type: String,
      required: true,
    },
    kondisi_interior: {
      type: String,
    },
    merk_produk: {
      type: String,
      required: true,
    },
    model_produk: {
      type: String,
      required: true,
    },
    tahun_produk: {
      type: Number,
      required: true,
    },
    transmisi: {
      type: String,
      required: true,
    },
    no_rangka: {
      type: String,
      required: true,
    },
    no_mesin: {
      type: String,
      required: true,
    },
    kapasitas_mesin: {
      type: Number,
      required: true,
    },
    odometer: {
      type: Number,
      required: true,
    },
    catatan: {
      type: String,
    },
    no_polisi: {
      type: String,
      required: true,
    },
    warna: {
      type: String,
      required: true,
    },
    stnk: {
      type: String,
      required: true,
    },
    exp_stnk: {
      type: String,
      required: true,
    },
    faktur: {
      type: String,
      required: true,
    },
    ktp: {
      type: String,
      required: true,
    },
    kwitansi: {
      type: String,
      required: true,
    },
    form_A: {
      type: String,
      required: true,
    },
    sph: {
      type: String,
      required: true,
    },
    keur: {
      type: String,
      required: true,
    },
    bpkb: {
      type: String,
      required: true,
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
          status: {
            type: String,
            default: "Tidak Aktif",
          },
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
