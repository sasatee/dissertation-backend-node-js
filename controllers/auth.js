const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError, NotFoundError } = require("../errors");
const axios = require("axios");
const sendEmail = require("./../util/email");
const crypto = require("crypto");
const generateVerificationToken = require("./../util/Verification");

// Add this function google idToken
const googleLogin = async (req, res) => {
  try {
    const { access_token, code } = req.body;

    // Validate the access token and code
    if (!access_token || !code) {
      return res
        .status(StatusCodes)
        .BAD_REQUEST.json({ error: "Access token and code are required." });
    }

    // Make a request to Google's tokeninfo endpoint to validate the token
    const tokenInfoResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${code}`
    );
    const tokenInfo = tokenInfoResponse.data;

    if (tokenInfo.aud !== process.env.TOKEN_INFO_GOOGLESIGNIN) {
      return res
        .status(StatusCodes)
        .UNAUTHORIZED.json({ error: "Invalid token." });
    }

    // Check if the user already exists in the database
    let user = await User.findOne({ email: tokenInfo.email });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = await User.create({
        firstName: tokenInfo.given_name,
        lastName: tokenInfo.family_name,
        email: tokenInfo.email,
        // Set a default or generated password, as the password field is required by your schema
        password: "PasswordEr123675@", // Consider a more secure method for generating passwords
        isDoctor: false, // Set default role or determine based on additional logic
        gender: "unspecified", // Set default or additional logic to determine gender
        profilePicture: tokenInfo.picture, // Google profile picture URL
      });
    }

    // Create a JWT token for the user
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
      user: {
        userId: user._id,
        firstname: user.firstName,
        lastname: user.lastName,
        gender: user.gender, // Return the placeholder to indicate the need for an update
        isDoctor: user.isDoctor,
        profilePicture: user.profilePicture,
        mustUpdateGender: user.gender === "unspecified", // Flag to indicate the frontend to prompt for gender selection
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      isDoctor,
      gender,
      profilePicture,
    } = req.body;

    // Check if the email already exists
    let checkEmail = await User.findOne({ email });
    if (checkEmail) {
      throw new BadRequestError("Email already exists");
    }
    const { verifytoken, hashedToken } = generateVerificationToken();

    // Create a new user
    const newUser = {
      firstName,
      lastName,
      email,
      isDoctor,
      gender,
      profilePicture,
      password,
      emailVerificationToken: hashedToken,
    };
    const user = await User.create(newUser);

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verifyemail/${verifytoken}`;
    const message = `Thank you for registering. Please verify your email by clicking the link: \n\n${verificationUrl}\n\nIf you did not request this, please ignore this email.`;

    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message: message,
    });

    // If the user is a doctor, create a doctor profile
    if (isDoctor) {
      // Assuming Doctor schema requires additional fields like 'name' and 'password'
      await Doctor.create({
        firstName,
        lastName,
        email,
        isDoctor,
        gender,
        profilePicture,
        doctorId: user._id,
      });
    }

    // Create a JWT token for the user
    const token = user.createJWT();

    // Response with user details and token
    res.status(StatusCodes.CREATED).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        isDoctor: user.isDoctor,
        doctorId: user.doctorId,
        profilePicture: user.profilePicture,
      },
      token,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    //const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const hashedToken = Math.floor(100000 * Math.random() * 10);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Token is invalid or has expired" });
    }

    // Clear the verification token and mark the email as verified
    user.emailVerificationToken = undefined;
    user.emailVerified = true;

    await user.save({ validateBeforeSave: false }); // Prevent password validation

    res.status(StatusCodes.OK).json({
      msg: "Email verified successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error verifying email" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new UnauthenticatedError(
        "Invalid Credentials, please verify email again "
      );
    }

    //verify email

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError(
        "Invalid Credentials,please verify the password again"
      );
    }

    // if (!user.emailVerified) {
    //   return res
    //     .status(StatusCodes.UNAUTHORIZED)
    //     .json({ msg: "Please verify your email to log in." });
    // }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      user: {
        userId: user._id,
        firstname: user.firstName,
        lastname: user.lastName,
        gender: user.gender,
        isDoctor: user.isDoctor,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  //1.Get user based on posted email
  const { email } = req.body;

  const user = await User.findOne({ email }); // find email

  if (!user) {
    throw new NotFoundError(`No email found`);
  }
  //2. if user exist generate a reset token
  const resetToken = await user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //3. SEND TOKEN BACK TO USER EMAIL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `We're have received a password reset request. Please use the below code to reset your password\n\n${resetToken}\n\nThis verification code will be valid/availble only for 10 minutes`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Password change request received`,
      message: message,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Verification code has been sent to user email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "There was an error occur sending password reset. Please try again later",
    });
  }
};

const resetPassword = async (req, res) => {
  //1. IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpired: { $gt: Date.now() },
  });

  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Token is invalid or has expires!",
    });
  }
  //2. resetting the user PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  user.passwordChangedAt = Date.now();

  user.save();

  //.#.LOGIN USER
  const loginToken = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      userId: user._id,
      firstname: user.firstName,
      lastname: user.lastName,
      gender: user.gender,
      isDoctor: user.isDoctor,
      profilePicture: user.profilePicture,
    },
    loginToken,
  });
};

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
