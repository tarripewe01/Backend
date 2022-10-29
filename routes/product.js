const express = require("express");
const router = express.Router();

// @route   GET api/product
// @desc    Test route
// @access  Public
router.get("/", (req, res) => {
  res.send("Product route");
});

module.exports = router;
