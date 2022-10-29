const express = require("express");
const connectDB = require("./db");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => {
  res.send("API Running!");
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`server is running in port ${PORT}`));
