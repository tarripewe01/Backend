const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
  },
  {
    timestamps: true,
  }
);

module.exports = Test = mongoose.model("Test", TestSchema);
