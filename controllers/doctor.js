const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");

const getAllDoctors = async (req, res) => {
    try {
      
    
        const doctors = await Doctor.find()
        res.status(StatusCodes.OK).json({ doctors: doctors, count: doctors.length });
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'unauthentication error' });
    }
}

module.exports = { getAllDoctors };
