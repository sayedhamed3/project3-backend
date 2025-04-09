const router = require("express").Router();
const Classes = require("../models/Classes");
const mongoose = require("mongoose");
const verifyToken = require("../middleware/verify-token");

router.get("/", verifyToken, async (req, res) => {
  try {
    const allClasses = await Classes.find().populate(["plan","trainer","startTime","endTime","capacity","daysOfWeek"])
    res.json(allClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// the bellow post route needs to be limited to users with the "trainer" role, so that only trainers can create classes
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
        return res.status(403).json({ error: "Only trainers can create classes" });
      }
    req.body.trainer = req.user._id;
    const createdClass = await Classes.create(req.body);
    res.status(201).json(createdClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.put("/:classId", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({ error: "Invalid Class ID" });
    }
    const foundClass = await Classes.findById(req.params.classId);
    if (!foundClass.trainer.equals(req.user._id)) {
      return res.status(403).json({ error: "You are not authorized to edit this class" });
    }
    const updatedClass = await Classes.findByIdAndUpdate(req.params.classId, req.body, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete("/:classId", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({ error: "Invalid Class ID" });
    }
    const foundClass = await Classes.findById(req.params.classId);
    if (!foundClass.trainer.equals(req.user._id)) {
      return res.status(403).json({ error: "You are not authorized to delete this class" });
    }
    await Classes.findByIdAndDelete(req.params.classId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;