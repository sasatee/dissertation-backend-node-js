const express = require("express");
const router = express.Router();

const { getAllDoctors } = require("../controllers/doctor");

router.route("/").get(getAllDoctors);

module.exports = router;
