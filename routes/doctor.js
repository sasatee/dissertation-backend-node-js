const express = require("express");
const router = express.Router();

const { getAllDoctors,getDoctorById } = require("../controllers/doctor");

router.route("/").get(getAllDoctors);
router.route("/:id").get(getDoctorById)

module.exports = router;
