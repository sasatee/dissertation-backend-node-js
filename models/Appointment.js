const mongoose = require("mongoose");
const User = require("./User");
const Doctor = require("./Doctor");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor", // Link to the Doctor model
      required: [true, "Doctor ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Link to the User model
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },
    bookedTime: { 
    type: Date, 
    required: true 
    },
    bookedTimeAMOrPM:{
      type:String,
      require:true
    },
    profilePicture: {
    type: String,
   
  }

  },
  // { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
