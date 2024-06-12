const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profile');


router.route("/:id").patch(updateUserProfile).get(getUserProfile);


module.exports = router;
