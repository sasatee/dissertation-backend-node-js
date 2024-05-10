const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/not-found");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const mongoose = require("mongoose");

// Get all Appointments
const getAllAppointments = async (req, res) => {
  const { userId, isDoctor } = req.user;

  let filter = {};
  if (!isDoctor) {
    filter.userId = userId; // Only return appointments for the logged-in user unless they are a doctor
  }

  const appointments = await Appointment.find(filter).sort("createdAt");
  res.status(StatusCodes.OK).json({ appointments, count: appointments.length });
};

// Get an Appointment by ID
const getAppointment = async (req, res) => {
  const { userId } = req.user;
  const { id: AppointmentId } = req.params;

  const appointment = await Appointment.findOne({
    _id: AppointmentId,
    // userId: userId, // Ensure the appointment belongs to the logged-in user
  });

  if (!appointment) {
    throw new NotFoundError(`No appointment found with id ${AppointmentId}`);
  }

  res.status(StatusCodes.OK).json({ appointment });
};

// Create an Appointment
const createAppointment = async (req, res) => {
  const { userId } = req.user;
  const { doctorId, bookedTime, bookedTimeAMOrPM } = req.body;

  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid or missing doctor ID" });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Doctor not found" });
  }

  if (!bookedTime) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Booking time is required" });
  }
  if (!bookedTimeAMOrPM) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Booking time in Am or Time is required" });
  }

  // Extract the profilePicture field from the doctor model
  //cahnge if neccesary
  const { lastName, profilePicture, firstName, price } = doctor;


  //
  

  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: userId,
      bookedTime: new Date(bookedTime),
      profilePicture: profilePicture,
      price: price,
      doctorName: `${firstName} ${lastName}`,
    });

    doctor.appointments.push(appointment._id);
    await doctor.save();

    res.status(StatusCodes.CREATED).json({ appointment });
  } catch (err) {
    console.error(`Error creating appointment: `, err);
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Update an Appointment
const updateAppointment = async (req, res) => {
  const { userId } = req.user;

  const { id: AppointmentId } = req.params;

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: AppointmentId,
      //userId: userId, // Ensure the appointment belongs to the logged-in user
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!appointment) {
    throw new NotFoundError(`No appointment found with id ${AppointmentId}`);
  }

  res.status(StatusCodes.OK).json({ appointment });
};

// Delete an Appointment
const deleteAppointment = async (req, res) => {
  const { userId } = req.user;
  const { id: AppointmentId } = req.params;

  const appointment = await Appointment.findOneAndDelete({
    _id: AppointmentId,
    //userId: userId, // Ensure the appointment belongs to the logged-in user
  });

  if (!appointment) {
    throw new NotFoundError(`No appointment found with id ${AppointmentId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Successfully deleted" });
};

module.exports = {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
