const express = require("express");
const router = express.Router();

const { login, register,googleLogin,forgotPassword,resetPassword,verifyEmail } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google-login",googleLogin)
router.get("/verifyemail/:token", verifyEmail);
router.post("/forgotpassword",forgotPassword)
router.patch("/resetpassword/:token",resetPassword)




module.exports = router;
