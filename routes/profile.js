const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const ProfileModel = require("../models/Profile");
const UserModel = require("../models/User");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar", "gender", "email"]);

    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("phone", "Phone is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    check("ktp", "KTP is required").not().isEmpty(),
    check("bank", "Bank is required").not().isEmpty(),
    check("bank_account", "Bank Account is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { phone, address, ktp, npwp, bank, bank_account } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (phone) profileFields.phone = phone;
    if (address) profileFields.address = address;
    if (ktp) profileFields.ktp = ktp;
    if (npwp) profileFields.npwp = npwp;
    if (bank) profileFields.bank = bank;
    if (bank_account) profileFields.bank_account = bank_account;

    try {
      let profile = await ProfileModel.findOne({
        user: req.user.id,
      });

      if (profile) {
        // Update
        profile = await ProfileModel.findOneAndUpdate(
          {
            user: req.user.id,
          },
          {
            $set: profileFields,
          },
          {
            new: true,
          }
        );

        return res.json(profile);
      }

      // Create
      profile = new ProfileModel(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
