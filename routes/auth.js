const express = require("express");
const router = express.Router();

const { login, register,googleLogin,forgotPassword,resetPassword } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google-login",googleLogin)
router.post("/forgotpassword",forgotPassword)
router.patch("/resetpassword/:token",resetPassword)

module.exports = router;
