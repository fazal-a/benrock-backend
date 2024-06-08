const User = require("../models/user");
// import SuccessHandler from "../utils/SuccessHandler";
// import ErrorHandler from "../utils/ErrorHandler";
const { ErrorHandler } = require("../utils/ErrorHandler");
const { SuccessHandler } = require("../utils/SuccessHandler");
const { createHtmlTemplate } = require("../utils/createHtmlTemplate");
const sendMail = require("../utils/sendMail");

//register
const register = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { name, email, password, role, latitude, longitude } = req.body;
    console.log("🚀 ~ file: authController.js:13 ~ register ~ name, email, password, role, latitude, longitude:", name, email, password, role, latitude, longitude)
    if (
      !password.match(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      )
    ) {
      return ErrorHandler(
        "Password must contain atleast one uppercase letter, one special character and one number",
        400,
        req,
        res
      );
    }
    const user = await User.findOne({ email });
    if (user) {
      return ErrorHandler("User already exists", 400, req, res);
    }
    // let encrypted = await hashPassword(password);
    const payload = {
      name,
      email,
      password,
      role,
      likes: []
    }
    if (latitude !== undefined && longitude !== undefined) {
      payload.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }
    console.log("payload", payload);
    let newUser = await User.create(payload);

    if (newUser)
      return SuccessHandler({ message: "Registered successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const createRole = async (req, res) => {
//   // #swagger.tags = ['auth']
//   try {
//     const { name, permissions } = req.body;
//     console.log({
//       name,
//       permissions
//     });
//     const user = await RoleRepository.findOne({ where: { name: ILike(name) } });
//     if (user) {
//       return ErrorHandler("Role with this name already exists", 400, req, res);
//     }
//     const payload = {
//       name,
//       permissions
//     };
//     let newUser = await RoleRepository.save(payload);
//     if (newUser) return SuccessHandler("Role created successfully", 200, res);
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

// //request email verification token
const requestEmailToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (! user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);
    const emailVerificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = emailVerificationTokenExpires;
    await user.save();

    const subject = "Email Verification Token";
    const textMessage = `Your email verification token is ${emailVerificationToken} and it expires in 10 minutes.`;
    const heading= "Account Verification";
    const message = "Thank you for registering with us. To complete your email verification, please use the following token:";
    const htmlContent = createHtmlTemplate(heading, message, emailVerificationToken );
    await sendMail(email, subject, textMessage, htmlContent );

    return SuccessHandler(`Email verification token sent to ${email}`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//verify email token
const verifyEmail = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email, emailVerificationToken } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist"
      });
    }
    if (
      user.emailVerificationToken !== emailVerificationToken ||
      user.emailVerificationTokenExpires < Date.now()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    jwtToken = user.getJWTToken();
    await user.save();
    return SuccessHandler("Email verified successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//login
const login = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email, password, latitude, longitude } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }

    let result = await user.comparePassword(password);
    if (result) {
      // Check if the coordinates are the default ones for New York
      const defaultLatitude = '40.7128';
      const defaultLongitude = '-74.0060';

      if (latitude !== defaultLatitude || longitude !== defaultLongitude) {
        user.location = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
        await user.save();
      }

      let jwtToken = await user.getJWTToken();

      return SuccessHandler(
          {
            token: jwtToken,
            user
          },
          200,
          res
      );
    } else {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
  } catch (error) {
    console.log("error", error);
    return ErrorHandler(error, 500, req, res);
  }
};

module.exports = login;


const getUsers = async (req, res) => {
  // #swagger.tags = ['auth']

  try {

    const users = await User.find({ emailVerified: true }).select("-password");
    res.json(users);
  } catch (error) {
    console.log("error", error);
    return ErrorHandler(error, 500, req, res);
  }
};

//logout
// const logout = async (req, res) => {
//   // #swagger.tags = ['auth']

//   try {
//     req.user = null;
//     return SuccessHandler("Logged out successfully", 200, res);
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

//forgot password
const forgotPassword = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const passwordResetToken = Math.floor(100000 + Math.random() * 900000);
    const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpires = passwordResetTokenExpires;
    await user.save();
    const textMessage = `Your password reset token is ${passwordResetToken} and it expires in 10 minutes`;
    const heading= "Password Reset Request";
    const message = "You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please use the following token to reset your password:";
    const htmlContent = createHtmlTemplate(heading, message, passwordResetToken );
    const subject = `Password reset token`;
    await sendMail(email, subject, textMessage, htmlContent );
    return SuccessHandler(`Password reset token sent to ${email}`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//reset password
const resetPassword = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email, passwordResetToken, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    if (
      user.passwordResetToken !== passwordResetToken ||
      user.passwordResetTokenExpires < Date.now()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    return SuccessHandler("Password reset successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  register,
  login,
  getUsers,
  verifyEmail,
  requestEmailToken,
  forgotPassword,
  resetPassword,
};

