const User = require("../models/User"); // user model
const catchAsyncErrors = require("../middlewares/catchAsyncErrors"); // errors file
const ErrorHandler = require("../utils/errorHandler"); // error class
const sendToken = require("../utils/jwtToken"); // send jwtoken for cookie

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body; // get from form

  // create new user in db
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // pass user to sendToken in jwtToken
  sendToken(user, 200, res);

  // return response
  // res.status(200).json({
  //   success: true,
  //   message: "User successfully registered",
  //   data: user, // pass user data
  //   token: token // pass webtoken
  // });
});

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body; // get from form
  // check if email, pass entered
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400)); // pass errors to error class constructor
  }

  // find user in collection in db
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401)); // pass errors to error class constructor
  }

  // pass entered password to model method comparePassword
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // send response to client
  sendToken(user, 200, res);

  // // create json webtoken
  // const token = user.getJwtToken();
  // res.status(200).json({
  //   success: true,
  //   token // send to client, later send back from cookie for server to verify signature
  // });
});
