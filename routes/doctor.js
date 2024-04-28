const express = require("express");
const router = express.Router();

const {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} = require("../controllers/doctor");

router.route("/").get(getAllDoctors);
router.route("/:id").patch(updateDoctor).get(getDoctorById);

module.exports = router;
