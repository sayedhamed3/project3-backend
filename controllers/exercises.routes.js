const router = require("express").Router();
const mongoose = require("mongoose");
const Exercise = require("../models/Exercise"); // Import the Exercise model

// Create a new exercise
router.post("/", async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all exercises
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single exercise by ID
router.get("/:id", async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise)
      return res.status(404).json({ message: "Exercise not found" });
    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an exercise by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExercise)
      return res.status(404).json({ message: "Exercise not found" });
    res.status(200).json(updatedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an exercise by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise)
      return res.status(404).json({ message: "Exercise not found" });
    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
// This code defines the routes for managing exercises in the application.
// It includes routes for creating, retrieving, updating, and deleting exercises.
