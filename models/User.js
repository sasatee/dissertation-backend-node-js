const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    minlength: 3,
    maxlength: 50,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "unspecified"],
    required: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
  },
  rating: {
    type: Number,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: String,
  passwordResetExpired: Date,
  passwordChangedAt: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  const payload = {
    userId: this._id,
    firstname: this.firstName,
    lastname: this.lastName,
    isDoctor: this.isDoctor,
    gender: this.gender,
    profilePicture: this.profilePicture,
  };

  if (this.isDoctor) {
    payload.doctorId = this.doctorId;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || !candidatePassword) {
    throw new Error("Password comparison error: Invalid input");
  }

  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createResetPasswordToken = async function () {
  const token = Math.floor(100000 * Math.random() * 10).toString();

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  return token;
};

module.exports = mongoose.model("User", UserSchema);
