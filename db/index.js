const mongoose = require("mongoose");
const db =
  "mongodb+srv://ITC-Finance:DO5omFW5ESPEwXtv@itc-finance.8o4u6ih.mongodb.net/BE_Lelang_ITC?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
