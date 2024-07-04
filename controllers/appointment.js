const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors/not-found");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const mongoose = require("mongoose");

//get all appoitment doctor has

const getAllAppointments = async (req, res) => {
  const { userId, isDoctor, doctorId } = req.user;

  let filter = {};
  if (isDoctor) {
    filter.doctorId = doctorId; // Fetch appointments for the doctor
  } else {
    filter.userId = userId; // Fetch appointments for the user
  }

  try {
    const appointments = await Appointment.find(filter).sort("createdAt");
    res
      .status(StatusCodes.OK)
      .json({ appointments, count: appointments.length });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

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
  const { doctorId, bookedTime, bookedTimeAMOrPM, durationMinutes } = req.body;

  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid or missing doctor ID" });
  }

  const doctor = await Doctor.findById(doctorId);
  const user = await User.findById(userId);
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
  //time slot
  const startTime = new Date(bookedTime);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  // Check for overlapping appointments
  const existingAppointments = await Appointment.find({
    doctorId: doctorId,
    bookedTime: {
      $lt: endTime, // End time of new appointment is after start time of existing appointments
      $gte: startTime, // Start time of new appointment is before end time of existing appointments
    },
  });

  if (existingAppointments.length > 0) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "Time slot is already booked.",
    });
  }

  //

  // Extract the profilePicture field from the doctor model
  //cahnge if neccesary

  const { lastName, profilePicture, firstName, price } = doctor;
  const {
    firstName: userFirstName,
    lastName: userSurname,
    profilePicture: userProfilePicture,
    gender: gender,
  } = user;

  //

  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: userId,
      bookedTime: startTime,
      profilePicture: profilePicture,
      price: price,
      durationMinutes,
      userFullName: `${userFirstName} ${userSurname}`,
      userProfilePicture: userProfilePicture,
      doctorName: `${firstName} ${lastName}`,
      gender: gender,
    });

    // doctor.appointments.push(appointment._id);
    // await doctor.save();

    res.status(StatusCodes.CREATED).json({ appointment });
  } catch (err) {
    console.error(`Error creating appointment: `, err);
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Update an Appointment
// const updateAppointment = async (req, res) => {
//   const { userId } = req.user;

//   const { id: AppointmentId } = req.params;

//   const appointment = await Appointment.findOneAndUpdate(
//     {
//       _id: AppointmentId,
//       //userId: userId, // Ensure the appointment belongs to the logged-in user
//     },
//     req.body,
//     { new: true, runValidators: true }
//   );

//   if (!appointment) {
//     throw new NotFoundError(`No appointment found with id ${AppointmentId}`);
//   }

//   res.status(StatusCodes.OK).json({ appointment });
// };

// Update an Appointment
const updateAppointment = async (req, res) => {
  const { userId, doctorId } = req.user;
  console.log("Doctor Id", req.user.doctorId, "USER ID", req.user.userId);
  const { id: AppointmentId } = req.params;
  const { bookedTime, durationMinutes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    console.log(doctorId);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid doctor ID" });
  }

  if (!bookedTime) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Booking time is required" });
  }

  const startTime = new Date(bookedTime);

  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  //console.log(startTime,endTime)

  try {
    // Check for overlapping appointments
    const existingAppointments = await Appointment.find({
      doctorId: doctorId,
      _id: { $ne: AppointmentId }, // Exclude current appointment
      bookedTime: {
        $lt: endTime, // End time of new appointment is after start time of existing appointments
        $gte: startTime, // Start time of new appointment is before end time of existing appointments
      },
    });

    if (existingAppointments.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Time slot is already booked.",
      });
    }

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: AppointmentId,
        // userId: userId, // Ensure the appointment belongs to the logged-in user
      },
      {
        ...req.body,
        bookedTime: startTime,
      },
      { new: true, runValidators: true }
    );
    // console.log(appointment)

    if (!appointment) {
      throw new NotFoundError(`No appointment found with id ${AppointmentId}`);
    }

    res.status(StatusCodes.OK).json({ appointment });
  } catch (err) {
    console.error(`Error updating appointment: `, err);
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
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
