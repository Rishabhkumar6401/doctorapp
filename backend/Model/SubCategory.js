const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category:{ 
    type:String , 
    required: true                 
    },
    price:{
        type:Number,
        required:true
    },
    referralFee:{
        type:Number,
        required:true
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
