const router = require('express').Router()
const  Plan= require("../models/Plan")
const Classes = require("../models/Classes")
const verifyToken = require("../middleware/verify-token")
const mongoose = require('mongoose')
const e = require('express')

router.get("/",verifyToken,async(req,res)=>{
    try{
        const allPlans = await Plan.find({visibility:true}).populate("Maker","comments.author","exercises.exercise")
        res.json(allPlans)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}
)

roueter.get("/:planId",verifyToken,async(req,res)=>{
    try{
        const foundPlan = await Plan.findById(req.params.Planid).populate("Maker","comments.author","exercises.exercise")
        res.json(foundPlan)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

router.get("/private", verifyToken, async (req, res) => {
    try {
        const privatePlans = await Plan.find({
            visibility: false,
            Maker: req.user._id 
        }).populate("Maker","comments.author","exercises.exercise");
        
        res.json(privatePlans);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

router.post("/",verifyToken,async(req,res)=>{
    try{
        req.body.Maker = req.user._id
        const createdPlan = await Plan.create(req.body)
        Plan.Maker=req.user
        res.status(201).json(createdPlan)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})
router.put("/:Planid",verifyToken,async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.Planid)) {
            return res.status(400).json({ error: "Invalid Plan ID" });
        }
        const foundPlan = await Plan.findById(req.params.Planid)
        if (!foundPlan.Maker.equals(req.user._id)) {
            return res.status(403).json({ error: "You are not authorized to edit this plan" });
        }
        console.log(foundPlan)
        console.log(req.user._id)
        if(!foundPlan.Maker.equals(req.user._id)){
            return res.status(403).json({error:"You are not authorized to edit this plan"})
        }
        const updatedPlan = await Plan.findByIdAndUpdate(req.params.Planid,req.body,{new:true})
        res.json(updatedPlan)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})
router.delete("/:Planid",verifyToken,async(req,res)=>{
    try{
        const {Planid} = req.params
        
        const foundPlan = await Plan.findById(Planid)
        if(!foundPlan.Maker.equals(req.user._id)){
            return res.status(403).json({error:"You are not authorized to delete this plan"})
        }
        const deletedPlan = await Plan.findByIdAndDelete(req.params.Planid)
        res.json(deletedPlan)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})
router.post("/:Planid/comment",verifyToken,async(req,res)=>{
    try{
        req.body.Maker = req.user._id
        const foundPlan = await Plan.findById(req.params.Planid)

        foundPlan.comments.push(req.body)
        foundPlan.save()
        res.status(201).json(foundPlan)
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

router.post("/:Planid/exercise", verifyToken, async (req, res) => {
    try {
        const { exerciseId, sets } = req.body;
 
        if (!exerciseId || !sets || !Array.isArray(sets)) {
            return res.status(400).json({ error: "exerciseId and sets array are required" });
        }

        const foundPlan = await Plan.findById(req.params.Planid);
        const foundExercise = await Exercise.findById(exerciseId);
        
        if (!foundPlan || !foundExercise) {
            return res.status(404).json({ error: "Plan or Exercise not found" });
        }

        const validatedSets = sets.map(set => {
            if (!set.reps || typeof set.reps !== 'number') {
                throw new Error("Each set must have a numeric reps value");
            }
            return { reps: set.reps };
        });

        foundPlan.exercises.push({
            exercise: foundExercise._id,
            sets: validatedSets
        });
        
        await foundPlan.save();
        res.status(201).json(foundPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:Planid/exercise/:exerciseId", verifyToken, async (req, res) => {
    try {
        const { sets } = req.body;
        const foundPlan = await Plan.findById(req.params.Planid);
        
        if (!foundPlan) {
            return res.status(404).json({ error: "Plan not found" });
        }

        const planExercise = foundPlan.exercises.find(
            ex => ex.exercise.toString() === req.params.exerciseId
        );

        if (!planExercise) {
            return res.status(404).json({ error: "Exercise not found in plan" });
        }

        // Validate and update sets
        if (sets && Array.isArray(sets)) {
            planExercise.sets = sets.map(set => {
                if (!set.reps || typeof set.reps !== 'number') {
                    throw new Error("Each set must have a numeric reps value");
                }
                return { reps: set.reps };
            });
        }

        await foundPlan.save();
        res.status(200).json(foundPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:Planid/exercise/:exerciseId", verifyToken, async (req, res) => {
    try {
        const foundPlan = await Plan.findById(req.params.Planid);
        
        if (!foundPlan) {
            return res.status(404).json({ error: "Plan not found" });
        }

        const exerciseIndex = foundPlan.exercises.findIndex(
            ex => ex.exercise.toString() === req.params.exerciseId
        );

        if (exerciseIndex === -1) {
            return res.status(404).json({ error: "Exercise not found in plan" });
        }

        foundPlan.exercises.splice(exerciseIndex, 1);
        await foundPlan.save();
        res.status(200).json(foundPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get("/:Planid/exercise/:exerciseId", verifyToken, async (req, res) => {
    try {
        const foundPlan = await Plan.findById(req.params.Planid)
            .populate('exercises.exercise');
        
        if (!foundPlan) {
            return res.status(404).json({ error: "Plan not found" });
        }

        const planExercise = foundPlan.exercises.find(
            ex => ex.exercise._id.toString() === req.params.exerciseId
        );

        if (!planExercise) {
            return res.status(404).json({ error: "Exercise not found in plan" });
        }

        res.status(200).json(planExercise);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router