const Job = require("../models/Job"); // import job model
const geoCoder = require("../utils/geocoder"); // get latitude and longitude
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors"); // async errors
const APIFilters = require("../utils/apiFilters"); // class

// Controller will handle responses

// Get Jobs
exports.getJobs = catchAsyncErrors(async (req, res, next) => {
  //pass params to contructor in class:collection to query, query in url
  const apiFilters = new APIFilters(Job.find(), req.query)
    .filter() // url param after?
    .sort() // sort method
    .limitFields() // limit fields
    .searchByQuery() // search
    .pagination(); // pagination

  const jobs = await apiFilters.query;

  // response in json
  res.status(200).json({
    success: true,
    message: "All Jobs",
    total_results: jobs.length,
    data: jobs // return jobs
  });
});

// Create Job => /api/v1/job/new
exports.newJob = catchAsyncErrors(async (req, res, next) => {
  // adding new user to body to pass userid to job to see who posted the job
  req.body.user = req.user.id;
  // job object using body
  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "Job created",
    data: job // return job
  });
});

// Search job within radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get latitude and longitude from geocoder
  const loc = await geoCoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;
  const radius = distance / 3963; // earth radius

  // set location field in model by calculation
  const jobs = await Job.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius]
      }
    }
  });

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs // return jobs
  });
});

// Update job => /api/v1/job/:id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id); // find in job model/document where url :id

  if (!job) {
    return next(new ErrorHandler("Job not found!", 404)); // pass error params to constructor
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    message: "Job updated!",
    data: job // return job
  });
});

// Delete job => /api/v2/job/:id
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id); // find in job model/document where url :id

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found!"
    });
  }

  job = await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Job deleted!"
  });
});

// Get single job with id and slug using and => /api/v2/job/:id/:slug
exports.getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.find({ $and: [{ _id: req.params.id }, { slug: req.params.slug }] }); // find in job model/document where url :id

  if (!job || job.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Job not found!"
    });
  }

  res.status(200).json({
    success: true,
    message: "Job with id and slug found!",
    data: job // return job
  });
});

// Get stats about topic => /api/v2/stats/:topic
exports.jobStats = catchAsyncErrors(async (req, res, next) => {
  const stats = await Job.aggregate([
    ({
      // array of objs search mulitple documents
      $match: { $text: { $search: `/${req.params.topic}/` } } // set :topic in url as params
    },
    // group documents to get result
    {
      $group: {
        _id: { $toUpper: "$experience" },
        totalJobs: { $sum: 1 },
        avgPosition: { $avg: "$positions" },
        avgSalary: { $avg: "$salary" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" }
      }
    })
  ]);

  if (stats.length === 0) {
    return res.status(200).json({
      success: false,
      message: `No Stats found for ${req.params.topic}`
    });
  }

  res.status(200).json({
    success: true,
    message: `Stats found for ${req.params.topic}`,
    data: stats // return stats
  });
});
