const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    unique: true,
  },
  firstName: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  lastName: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  profilePicture: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  specialization: {
    type: String,
  },
  experience: {
    type: String,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
