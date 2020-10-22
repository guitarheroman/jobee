const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//check if user is authenticated: get token from header sent by client
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  let token;

  // access header: authorization. Receive login token by client. (Token which was sent to client upon login)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // header will contain Bearer token: split into array and get [1]: token
    token = req.headers.authorization.split(" ")[1];
  }
  // if no token sent
  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id); // get logged in user
  console.log(decoded);
  next();
});

// handle user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      //check user role in collection
      return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource.`, 403));
    }
    next();
  };
};
