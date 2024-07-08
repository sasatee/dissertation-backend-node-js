const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const registerAdmin = async (req, res) => {
  const { email, password,userName } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Admin already exists" });
    }

    const admin = new Admin({ email, password ,userName});
    await admin.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Admin registered successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    console.log(admin.userName)

    if (!admin) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const payload = { adminId: admin._id, username: admin.userName };
    console.log(payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_LIFETIME,
    });

    res.status(StatusCodes.CREATED).json({ token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};
module.exports = {
  registerAdmin,
  loginAdmin,
};
