const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 33,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
      trim: true,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
    
  },
  { timestamps: true }
);







module.exports = mongoose.model("User", userSchema);
