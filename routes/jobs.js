const express = require("express"); // express to create routes
const router = express.Router(); // create router
const { getJobs, newJob, getJobsInRadius, updateJob, deleteJob, getSingleJob, jobStats } = require("../controllers/jobsController"); // import controllers with async functions
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth"); // get token from header sent by client

// CREATE ROUTES

// GET /jobs
router.route("/jobs").get(getJobs); // set route call controller with the res
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius); // Get radius of Job
router.route("/job/:id/:slug").get(getSingleJob); // Get single job with id and slug
router.route("/stats/:topic").get(jobStats); // Get single job with id and slug

// POST /jobs
// middleware: is user authenticated, authorize roles to check if user can access this route

// router.route("/job/new").post(isAuthenticatedUser, authorizeRoles('employer', 'admin'), newJob); // broken authorizeRoles
router.route("/job/new").post(isAuthenticatedUser, authorizeRoles("employer", "admin"), newJob); // validate route, controller func

// PUT /jobs
// middleware: is user authenticated, authorize roles to check if user can access this route
router.route("/job/:id").put(isAuthenticatedUser, updateJob).delete(isAuthenticatedUser, deleteJob);

// export router for use in app js
module.exports = router;
