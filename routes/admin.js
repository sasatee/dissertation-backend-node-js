const express = require("express");
const router = express.Router();

const { registerAdmin,loginAdmin,deleteDoctor } = require("../controllers/admin");



router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.route("/doctor/:id").delete(deleteDoctor)




module.exports = router;
