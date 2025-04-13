const router = require("express").Router();
const Exercise = require("../models/Exercise");
const verifyToken = require("../middleware/verify-token");
const mongoose = require("mongoose");

// GET ALL EXERCISES
router.get("/", verifyToken, async (req, res) => {
  try {
    const exercises = await Exercise.find().select("-__v");
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET EXERCISE BY ID
router.get("/:exerciseId", verifyToken, async (req, res) => {
  try {
    // check if id is valdid
    if (!mongoose.Types.ObjectId.isValid(req.params.exerciseId)) {
      return res.status(400).json({ error: "Invalid Exercise ID" });
    }
    

    
    const exercise = await Exercise.findById(req.params.exerciseId).select("-__v");

    // check if exercise exists
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;