const router = require("express").Router();
const User = require("../models/User");
const verifyToken = require("../middleware/verify-token");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// GET ALL USERS
router.get("/", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
  
      const users = await User.find().select("-hashedPassword -__v");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// GET USER OF LOGGED IN USER
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-hashedPassword -__v");
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE USER
router.put("/:userId", verifyToken, async (req, res) => {
  try {

    // check if userID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // check if admin or logged in user
    if (req.params.userId !== req.user._id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (req.body.password) {
      req.body.hashedPassword = bcrypt.hashSync(req.body.password, 12);
      delete req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    ).select("-hashedPassword -__v");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE USER
router.delete("/:userId", verifyToken, async (req, res) => {
  try {
    // check if adin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // if user is trainer, delete trainer profile
    const trainerToDelete = await Trainer.findOne({ user: req.params.userId });
    if (trainerToDelete) {
      await Trainer.findByIdAndDelete(trainerToDelete._id);
    }

    await User.findByIdAndDelete(req.params.userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;