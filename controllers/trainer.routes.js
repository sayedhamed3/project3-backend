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
router.get("/:userId", async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ user: req.params.userId}).select("-__v");
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL TRAINERS
router.get("/", async (req, res) => {
  try {
    const trainers = await Trainer.find().select("-__v");
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE TRAINER
router.post("/", async (req, res) => {
  try {

    // check if existsing trainer profile
    const existingTrainer = await Trainer.findOne({ user: req.body.user });
    if (existingTrainer) {
      return res.status(409).json({ error: "Trainer profile already exists" });
    }

    const newTrainer = await Trainer.create(req.body);
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