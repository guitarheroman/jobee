const express = require("express"); // express to create routes
const router = express.Router(); // create router
const { registerUser, loginUser } = require("../controllers/authController"); // get method from controller

// create routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
