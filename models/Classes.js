const {Schema,model}=require('mongoose')

const classesSchema = new Schema({
    plan:{
        type:Schema.Types.ObjectId,
        ref:"Plan"
    },
    trainer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    daysOfWeek:{
        type:[String],
        required:true,
        enum:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    },
},{timestamps:true})

const Classes=new model("Classes",classesSchema)

module.exports=Classes