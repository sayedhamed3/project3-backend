const router = require("express").Router();
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const verifyToken = require("../middleware/verify-token");
const mongoose = require("mongoose");

// GET ALL TRAINERS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("user", "name avatar") // Show linked user details
      .select("-__v");
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET TRAINER (PUBLIC)
router.get("/:trainerId", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId)
      .populate("user", "name avatar") // Show linked user details
      .select("-__v");
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE TRAINER
router.post("/", verifyToken, async (req, res) => {
  try {
    // check if user is trainer
    const user = await User.findById(req.user.userId);
    if (user.role !== "trainer") {
      return res.status(403).json({ error: "User is not a trainer" });
    }

    // check if existsing trainer profile
    const existingTrainer = await Trainer.findOne({ user: req.user.userId });
    if (existingTrainer) {
      return res.status(409).json({ error: "Trainer profile already exists" });
    }

    const newTrainer = await Trainer.create({
      ...req.body,
      user: req.user.userId 
    });
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE TRAINER
router.put("/:trainerId", verifyToken, async (req, res) => {
  try {

    
    const trainer = await Trainer.findById(req.params.trainerId);
    // check if trainer is same as logged in user
    if (!trainer.user.equals(req.user.userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.trainerId,
      req.body,
      { new: true }
    );
    res.json(updatedTrainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;