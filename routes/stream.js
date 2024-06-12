const express = require("express");
const router = express.Router();

const { stream } = require("../controllers/stream");

router.route("/").get(stream);

module.exports = router;
