const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
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
  availability: {
    type: [String],
    require: false,
  },
  description: {
    type: String,
    require: false,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
