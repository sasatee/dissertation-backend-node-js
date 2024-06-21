const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/profile");
const multer = require("multer");

// Multer configuration for handling image uploads
const storage = multer.memoryStorage(); // Use memory storage if you don't want to store files locally

const upload = multer({ storage });

// Route definitions
router
  .route("/:id")
  .patch(upload.single("profilePicture"), updateUserProfile) // Include multer middleware here
  .get(getUserProfile);

module.exports = router;
