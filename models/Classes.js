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
        type:[Number],
        required:true,
        enum:[0,1,2,3,4,5,6] // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    },
},{timestamps:true})

const Classes=new model("Classes",classesSchema)

module.exports=Classes