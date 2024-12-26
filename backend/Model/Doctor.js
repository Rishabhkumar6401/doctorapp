const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:false,
        },
        phoneNo:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        totalCommission: {
            type: Number,
            required: false,
            default: 0, // Set default value to 0
        }
        
    },
    {timestamps:true}
)
const DoctorDB = mongoose.model("Doctor", DoctorSchema);
module.exports = DoctorDB;