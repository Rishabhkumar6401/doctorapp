const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
          phoneNo:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:false
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