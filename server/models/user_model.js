const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  firstname: {
    type: String,
    trim: true,
    max: 100,
  },
  lastname: {
    type: String,
    trim: true,
    max: 100,
  },
  age: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  let user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

userSchema.statics.emailTaken = async function (email) {
  const user = await this.findOne({ email }).exec();
  return user;
};

userSchema.methods.generateToken = function () {
  let user = this;
  const userObj = { _id: user._id.toHexString(), email: user.email };
  const token = jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: "1d" });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const match = await bcrypt.compare(password, user.password);
  return match;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
