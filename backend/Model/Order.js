const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
    {
        serialNo: {
            type: String,
            unique: true,
            required: true,
        },
        name : {
            type : String,
            required : true
        },
        age : {
            type : Number,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        phoneNo : {
            type : Number,
            required : true,
        },
        referredBy : {
            type: mongoose.Schema.Types.Mixed, // Reference to DoctorDB
            ref: "doctors", // Target collection
            required: true        
        },
        category:{
            type : String,
            required : true 

        },
        subcategory:{
            type : String,
            required : true 
        },
        fees:{
            type : Number,
            required : true 

        },
        discount:{
            type : Number,
            default:0

        },
        finalPayment:{
            type : Number,
            required : true 

        },
        paymentMode:{
            type : String,
            required : true 

        },
        referralFee:{
            type : Number,
            required : true 

        },
    },
    {timestamps:true}
)
const Order = mongoose.model("Order",OrderSchema);

module.exports = Order; 