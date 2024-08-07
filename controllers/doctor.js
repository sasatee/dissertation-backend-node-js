const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");


const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res
      .status(StatusCodes.OK)
      .json({ doctors: doctors, count: doctors.length });
  } catch (error) {
  
    console.error(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "unauthentication error" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Doctor not found" });
    }

    res.status(StatusCodes.OK).json({ doctor });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id: doctorId } = req.params; 

    // Update doctor profile
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: doctorId },
      req.body,
      { new: true, runValidators: true } // Return new object after update and run validation rules
    );

    // Check if the update was successful
    if (!updatedDoctor) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No doctor found with id ${doctorId}` });
    }

    // Send the updated doctor profile
    res.status(StatusCodes.OK).json({ doctor: updatedDoctor });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error", error: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, updateDoctor };
