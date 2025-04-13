const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    username: {
        type: String,
        required:[true,"Email is Required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    hashedPassword:{
        type:String,
        required:[true,"Password is Required"]
    },
    name:{
        type:String,
        required:[true,"Name is Required"],
        trim:true
    },
    avatar:{ type:String, defualt:"" },

    membership:{
        type: {
            type:String,
            enum:["monthly","annual","trial","trainer"],
            default:"trial"
        },
        isActive:{
            type:Boolean,
            default:false
        },
        startDate:{
            type:Date,
        },
        endDate:{
            type:Date
        }
    },
    metrics: {
        height: { type: Number}, //cm
        weight: { type: Number}, //kg
    },

    role: {
        type: String,
        enum: ["user", "trainer", "admin"],
        default: "user",
    },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const User = model("User",userSchema)

module.exports = User