const express = require("express");
const app = express();
const dotenv = require("dotenv"); // req dotenv package
const cookieParser = require('cookie-parser'); // cookie parser

// error handling
const errorMiddleWare = require("./middlewares/errors"); // middleware file

// body parser: to enable sending via json
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Connect to localdb
dotenv.config({ path: "./config/config.env" }); // use config.env variables
const connectDb = require("./config/database");
const ErrorHandler = require("./utils/errorHandler");
connectDb();

// routes
const jobs = require("./routes/jobs"); // assign route
const auth = require("./routes/auth"); // auth route

// use the routes files with the routes inside: prepend all jobs routes with /api/v1
app.use("/api/v1", jobs);
app.use("/api/v1", auth);

// ERRORS: handling uncaught exceptions ie variables that don't exist
process.on("uncaughtException", err => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to uncaughtException");
  process.exit(1);
});

// ERRORS: handle unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//middleware to handle errors
app.use(errorMiddleWare);

// access config file and run server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// ERRORS: handle unhandled exceptions
process.on("unhandledRejection", err => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to handled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
