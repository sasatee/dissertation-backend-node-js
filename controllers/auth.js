const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");
const axios = require ("axios")



// Add this function google idToken 
const googleLogin = async (req, res) => {
    try {
        const { access_token, code } = req.body;

        // Validate the access token and code
        if (!access_token || !code) {
          return res.status(StatusCodes).BAD_REQUEST.json({ error: 'Access token and code are required.' });
        }
      

        // Make a request to Google's tokeninfo endpoint to validate the token
        const tokenInfoResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${code}`);
        const tokenInfo = tokenInfoResponse.data;
        console.log("idToken:------",  code )
      
      

        if (tokenInfo.aud !== process.env.TOKEN_INFO_GOOGLESIGNIN) {
          return res.status(StatusCodes).UNAUTHORIZED.json({ error: 'Invalid token.' });
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
            password: "Sarvma@0133sa", // Consider a more secure method for generating passwords
            isDoctor: false, // Set default role or determine based on additional logic
            gender: 'other', // Set default or additional logic to determine gender
            profilePicture: tokenInfo.picture // Google profile picture URL
          });
        }

        // Create a JWT token for the user
        const token = user.createJWT();

        res.status(StatusCodes.OK).json({
          user: {
            firstname: user.firstName,
            lastname: user.lastName,
            gender: user.gender,
            isDoctor: user.isDoctor,
            profilePicture: user.profilePicture,
          },
          token,
        });
      // console.log(token)
          

      
      } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
};



const register = async (req, res) => {


  //if user is client
    const { email } = req.body;

    let checkEmail = await User.findOne({ email });
    if (checkEmail) {
      throw new BadRequestError("Email already existed");
    }

    const user = await User.create({ ...req.body });

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        firstname: user.firstName,
        lastname: user.lastName,
        isDoctor: user.isDoctor,
      },
      token,
    });

    //if user is a doctor , create doctor profile
    if (req.body.isDoctor) {
      await Doctor.create({
        ...req.body,
      });
    }


};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email }); // find email in mongo database

  if (!user) {
    throw new UnauthenticatedError(
      "Invalid Credentials, please verify email again "
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Invalid Credentials,please verify the password again"
    );
  }
  //compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      firstname: user.firstName,
      lastname: user.lastName,
      gender: user.gender,
      isDoctor: user.isDoctor,
      profilePicture: user.profilePicture,
    },
    token,
  });
};


module.exports = { register, login,googleLogin  };
