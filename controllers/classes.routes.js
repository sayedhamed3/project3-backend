const router = require("express").Router();
const Classes = require("../models/Classes");
const mongoose = require("mongoose");
const verifyToken = require("../middleware/verify-token");

router.get("/", verifyToken, async (req, res) => {
  try {
    const allClasses = await Classes.find().populate(["plan","trainer","startTime","endTime","capacity","daysOfWeek","registeredUsers"]);
    res.json(allClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// GET CLASS BY ID
router.get("/:classId", verifyToken, async (req, res) => {
  try{
    // check if id is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({ error: "Invalid Class ID" });
    }
    
    const foundClass = await Classes.findById(req.params.classId).populate("plan","trainer","registeredUsers");

    // check if class exists
    if (!foundClass) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(foundClass);
  }
  catch(error){
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

// REGISTER USER FOR CLASS
router.post("/:classId/register", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({ error: "Invalid Class ID" });
    }
    const foundClass = await Classes.findById(req.params.classId);
    if (foundClass.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ error: "You are already registered for this class" });
    }
    if (foundClass.capacity <= foundClass.registeredUsers.length) {
      return res.status(400).json({ error: "Class is full" });
    }
    foundClass.registeredUsers.push(req.user._id);
    await foundClass.save();
    res.json(foundClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// UNREGISTER USER FROM CLASS
router.post("/:classId/unregister", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.classId)) {
      return res.status(400).json({ error: "Invalid Class ID" });
    }
    const foundClass = await Classes.findById(req.params.classId);
    if (!foundClass.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ error: "You are not registered for this class" });
    }
    foundClass.registeredUsers.pull(req.user._id);
    await foundClass.save();
    res.json(foundClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;