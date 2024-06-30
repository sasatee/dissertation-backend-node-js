const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const mongoose = require("mongoose");

// Get user or doctor profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const doctorId = req.user.doctorId;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // If the user is a doctor, retrieve the doctor profile
    let doctorProfile = null;
    if (user.isDoctor) {
      doctorProfile = await Doctor.findById(doctorId);
      if (!doctorProfile) {
        throw new NotFoundError("Doctor profile not found");
      }
    }

    res.status(StatusCodes.OK).json({ user, doctorProfile });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { doctorId } = req.user;

    const {
      firstName,
      lastName,
      gender,
      profilePicture,
      specialization,
      experience,
      price,
      description,
      rating
    } = req.body;

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update user profile fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.gender = gender || user.gender;
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    await user.save();

    // Update doctor profile if the user is a doctor
    let doctorProfile = null;
    if (user.isDoctor) {
      if (!doctorId) {
        throw new BadRequestError("DoctorId is required for doctors");
      }

      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new BadRequestError("Invalid doctorId");
      }

      doctorProfile = await Doctor.findById(doctorId);
      if (!doctorProfile) {
        throw new NotFoundError("Doctor profile not found");
      }

      doctorProfile.firstName = firstName || doctorProfile.firstName;
      doctorProfile.lastName = lastName || doctorProfile.lastName;
      doctorProfile.specialization =
        specialization || doctorProfile.specialization;
      doctorProfile.experience = experience || doctorProfile.experience;
      doctorProfile.price = price || doctorProfile.price;
      doctorProfile.description = description || doctorProfile.description;
      doctorProfile.profilePicture =
        profilePicture || doctorProfile.profilePicture;
        doctorProfile.rating = rating || doctorProfile.rating

      await doctorProfile.save();
    }

    res.status(StatusCodes.OK).json({ user, doctorProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

// const updateUserProfile = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { doctorId } = req.user;

//     const {
//       firstName,
//       lastName,
//       gender,
//       profilePicture,
//       specialization,
//       experience,
//       price,
//       description,
//     } = req.body;

//     // Find the user first
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new NotFoundError("User not found");
//     }

//     // Update profile picture if URL is provided
//     if (profilePicture) {
//       user.profilePicture = profilePicture;
//     }

//     // Update other user profile fields
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.gender = gender || user.gender;

//     await user.save();

//     // Update doctor profile if the user is a doctor
//     let doctorProfile = null;
//     if (user.isDoctor && doctorId) {
//       // Ensure doctorId is valid ObjectId
//       if (!mongoose.Types.ObjectId.isValid(doctorId)) {
//         throw new BadRequestError("Invalid doctorId");
//       }

//       doctorProfile = await Doctor.findByIdAndUpdate(
//         doctorId,
//         { specialization, experience, price, description },
//         { new: true, runValidators: true }
//       );
//       if (!doctorProfile) {
//         throw new NotFoundError("Doctor profile not found");
//       }
//     }

//     res.status(StatusCodes.OK).json({ user, doctorProfile });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
//   }
// };

module.exports = { getUserProfile, updateUserProfile };
