const mongoose = require('mongoose');
const User = require("./User")
const Doctor = require("./Doctor")
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor', // Link to the Doctor model
   // required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Link to the User model
    required: true
  },
 
  reason: {
    type: String,
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('Appointment', appointmentSchema);