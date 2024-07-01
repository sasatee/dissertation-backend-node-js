
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profilePicture: {
    type: String,
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
    //required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);

