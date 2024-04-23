const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //  const user = User.findById(payload.id).select("-password")

    //  req.user =user

    //attach the user to the job routes
    req.user = {
      userId: payload.userId,
      firstname: payload.firstname,
      lastname: payload.lastname,
      isDoctor: payload.isDoctor,
      gender: payload.gender,
      profilePicture: payload.profilePicture,
      doctorId: payload.doctorId,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = authMiddleware;
