const mongoose = require("mongoose");

// Case Schema: For each patient's diagnostic case
const CaseSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    category: {
      type: String, // e.g., "Ultrasound"
      required: true,
    },
    subcategory: {
      type: String, // e.g., "Ultrasound Abdomen"
      required: true,
    },
    referralFee: {
      type: Number, // Fixed referral fee for the subcategory
      required: true,
    },
    discount: {
      type: Number, // Discount provided to the patient
      default: 0,
    },
    commission: {
      type: Number, // Calculated as referralFee - discount
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Date when the case was registered
    },
  },
  { timestamps: true }
);

const Cases = mongoose.model("Cases", CaseSchema);

module.exports = Cases;

