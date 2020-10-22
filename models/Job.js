const mongoose = require("mongoose");
const validator = require("validator"); // backend validation package, validate email
const slugify = require("slugify"); // create a slug for job
const geoCoder = require("../utils/geocoder"); // use geocoder

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter job title"],
    trim: true, // remove blanks before and after
    maxLength: [100, "Job description cannot exceed 100 characters"]
  },
  slug: String, // set using slugify
  description: {
    type: String,
    required: [true, "Please enter a job description"],
    maxLength: [1000, "Job description cannot exceed 1000 characters"]
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter a valid email address"] // validate email
  },
  address: {
    type: String,
    required: [true, "Please add an address"]
  },
  area: {
    type: String,
    required: [true, "Please add an area"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      index: "2dSphere"
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  company: {
    type: String,
    required: [true, "Please add a company"]
  },
  industry: {
    type: [String], // array of strings
    required: true,
    enum: {
      // enum: set values, use must pick from these values
      values: ["Business", "IT", "Banking", "Education", "Others"],
      message: "Please select correct options for industry"
    }
  },
  jobType: {
    type: String,
    required: true,
    enum: {
      values: ["Permanent", "Part time", "Internship"],
      message: "Please select correct options for industry"
    }
  },
  minEducation: {
    type: String,
    required: true,
    enum: {
      values: ["Batchelors", "Masters", "Phd"],
      message: "Please select correct options for education"
    }
  },
  positions: {
    type: Number,
    default: 1
  },
  experience: {
    type: String,
    required: true,
    enum: {
      values: ["No experience", "1 year - 2 years", "2 years - 5 years", "5 years+"]
    }
  },
  salary: {
    type: Number,
    required: [true, "Please enter expected salary for this job"]
  },
  postingDate: {
    type: Date,
    default: Date.now
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7) // add 7 days after
  },
  applicantsApplied: {
    type: [Object],
    select: false // hide from user
  },
  user: {
    type: mongoose.Schema.ObjectId, // get id from User model
    ref: "User", // User collection
    required: true
  }
});

// create job slug for model before saving, need this so don't use arrow func
JobSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true }); // lowercase
  next();
});

// set up location of job using geocoder
JobSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);

  // model location
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };
});

module.exports = mongoose.model("Job", JobSchema);
