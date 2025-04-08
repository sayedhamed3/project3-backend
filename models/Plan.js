const {Schema,model}=require('mongoose')

const commentSchema=new Schema({
    text:{
        type:String,
        required:true,
        maxLength:240
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const planSchema = new Schema({
    Name:{
        type:String,
        required:true,
    },
    Maker:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    Description:{
        type:String,
    },
    visibility:{
        type:Boolean,
        required:true
    },
    exercise:{
        type:Schema.Types.ObjectId,
        ref:"Exercise"
    },
    comments:[{commentSchema}]
},{timestamps:true})

const Plan=new model("Plan",planSchema)

module.exports=Plan