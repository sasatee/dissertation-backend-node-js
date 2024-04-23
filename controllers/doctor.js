const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res
      .status(StatusCodes.OK)
      .json({ doctors: doctors, count: doctors.length });
  } catch (error) {
    // Handle errors appropriately
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
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Doctor not found" });
    }

    res.status(StatusCodes.OK).json({ doctor });
  } catch (error) {
   
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};


module.exports = { getAllDoctors, getDoctorById };
