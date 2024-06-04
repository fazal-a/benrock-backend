const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config({ path: ".././src/config/config.env" });

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    }
  },
  description: String,
  phoneNumber: {
    type: String
  },

  prefix: {
    type: String
  },

  password: {
    type: String,
    required: true
    //validation will be before saving to db
  },
  photo: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },

  longitude: String,
  latitude: String,

  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: Number
  },
  emailVerificationTokenExpires: {
    type: Date
  },
  passwordResetToken: {
    type: Number
  },
  passwordResetTokenExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  },

  isActive: {
    type: Boolean,
    default: true
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    }
  }
});

userSchema.index({ location: "2dsphere" });

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("latitude") || this.isModified("longitude")) {
    this.location = {
      type: "Point",
      coordinates: [parseFloat(this.longitude), parseFloat(this.latitude)],
    };
  }
  next();
});
//jwtToken
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id,emailVerified:this.emailVerified }, process.env.JWT_SECRET);
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const user = mongoose.model("user", userSchema);

module.exports = user;
