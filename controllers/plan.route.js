const router = require('express').Router()
const  Plan= require("../models/Plan")
const Classes = require("../models/Classes")
const verifyToken = require("../middleware/verify-token")
const mongoose = require('mongoose')
const e = require('express')

router.get("/",verifyToken,async(req,res)=>{
    try{
        const allPlans = await Plan.find({visibility:true}).populate("Maker","comments.author")
        res.json(allPlans)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}
)

router.get("/private", verifyToken, async (req, res) => {
    try {
        const privatePlans = await Plan.find({
            visibility: false,
            Maker: req.user._id 
        }).populate("Maker","comments.author");
        
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

module.exports = router