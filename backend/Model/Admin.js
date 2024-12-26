const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true,  // Ensure usernames are unique
      },
      password: {
        type: String,
        required: true,
      },
    }
);

const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;
