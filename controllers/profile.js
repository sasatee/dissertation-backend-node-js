const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

// Get user or doctor profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If the user is a doctor, retrieve the doctor profile
    let doctorProfile = null;
    if (user.isDoctor) {
      doctorProfile = await Doctor.findOne({ doctorId: userId });
      if (!doctorProfile) {
        throw new NotFoundError("Doctor profile not found");
      }
    }

    res.status(StatusCodes.OK).json({ user, doctorProfile });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

// Update user or doctor profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, gender, profilePicture, specialization, experience, price, description } = req.body;

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update profile picture if URL is provided
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    // Update other user profile fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;

    await user.save();

    // Update doctor profile if the user is a doctor
    let doctorProfile = null;
    if (user.isDoctor) {
      doctorProfile = await Doctor.findOneAndUpdate(
        { doctorId: userId },
        { specialization, experience, price, description },
        { new: true, runValidators: true }
      );
      if (!doctorProfile) {
        throw new NotFoundError("Doctor profile not found");
      }
    }

    res.status(StatusCodes.OK).json({ user, doctorProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
