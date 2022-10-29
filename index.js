const express = require("express");
const connectDB = require("./db");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => {
  res.send("API Running!");
});

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/product", require("./routes/product"));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`server is running in port ${PORT}`));
