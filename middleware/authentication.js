const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");


const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    

    // Attach the user to the request
    req.user = {
      userId: payload.userId,
      firstname: payload.firstname,
      lastname: payload.lastname,
      isDoctor: payload.isDoctor,
      gender: payload.gender,
      profilePicture: payload.profilePicture,
      email:payload.email,
      doctorId: payload.isDoctor ? payload.doctorId : null,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = authMiddleware;
