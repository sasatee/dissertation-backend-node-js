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

// // Get an Appointment by ID
// const getAppointment = async (req, res) => {
//   const { userId } = req.user;
//   const { id: AppointmentId } = req.params;

//   const appointment = await Appointment.findOne({
//     _id: AppointmentId,
//     // userId: userId, // Ensure the appointment belongs to the logged-in user
//   });

//   if (!appointment) {
//     throw new NotFoundError(`No appointment found with id ${AppointmentId}`);
//   }

//   res.status(StatusCodes.OK).json({ appointment });
// };

// Get an Appointment by ID or by bookedTime date
// const getAppointment = async (req, res) => {
//   // const { userId } = req.user;
//   const { id: userId } = req.params;
//   const { bookedDate } = req.query;

//   let filter = { userId: userId };

//   if (bookedDate) {
//     const startDate = new Date(bookedDate);
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 1); // Increment the date to get the next day

//     filter.bookedTime = { $gte: startDate, $lt: endDate };
//   }

//   const appointment = await Appointment.find(filter);

//   if (!appointment) {
//     throw new NotFoundError(`No appointment found with id ${userId}`);
//   }

//   res.status(StatusCodes.OK).json({ appointment });
// };

//find appointment by user Id and user date book
const getAppointment = async (req, res) => {
  // const {userId} = req.user;
  const { id: userId } = req.params; // Get userId from params
  const { bookedDate } = req.query; // Get bookedDate from query

  let filter = { userId: userId };
  if (bookedDate) {
    const startDate = new Date(bookedDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Increment the date to get the next day

    filter.bookedTime = { $gte: startDate, $lt: endDate };
  }

  const appointments = await Appointment.find(filter);

  if (appointments.length === 0) {
    throw new NotFoundError(
      `No appointments found for user id ${userId} on date ${bookedDate}`
    );
  }

  res.status(StatusCodes.OK).json({
    appointments,
    count: appointments.length,
  });
};

// Create an Appointment by user
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
