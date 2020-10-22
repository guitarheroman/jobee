const mongoose = require("mongoose");
const validator = require("validator"); // backend validation package, validate email
const bcrypt = require("bcryptjs"); // encrypt password
const jwt = require("jsonwebtoken"); // json webtoken

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address"]
  },
  role: {
    type: String,
    enum: {
      values: ["user", "employer"],
      message: "Please select a correct role"
    },
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password for user"],
    minlength: [8, "Your password must be at least 8 characters long"],
    select: false // hide pass
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date
});

// Encrypt password by hashing it
UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10); // pass, salt value (strength) of 10
});

// Return jsonwebtoken
UserSchema.methods.getJwtToken = () => {
  // user id, secret key
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare passwords in db
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // entered pass, db pass
};

module.exports = mongoose.model("User", UserSchema);
