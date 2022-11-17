const express = require("express");
const connectDB = require("./db");
const moment = require("moment");
const StatusChange = require("./middleware/statusChange");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");

dotenv.config();
const app = express();

// Connect Database
connectDB();

//cron

const job = cron.schedule("* * * * *", async () => {
  StatusChange();
  // console.log("Ticker");
});
job.start();

// Init Middleware
app.use(express.json({ extended: false }));
// app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
  })
);
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
