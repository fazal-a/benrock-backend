const User = require("../models/user");
// import ErrorHandler from "../utils/ErrorHandler";
const { ErrorHandler } = require("../utils/ErrorHandler");
const { uploadImages } = require("../middleware/uploadImage");
// get profile
const getProfile = async (req, res) => {
  // #swagger.tags = ['profile']
  try {
    let _id = req?.user?._id;
    let profile = await User.findById(_id).select("-password");

    return res.json(profile);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};

// update profile
const updateProfile = async (req, res) => {
  // #swagger.tags = ['profile']
  try {
    let { id, email, latitude, longitude, ...rest } = req?.body;
    let updateObject = {email, ...rest };

    if (email) {
      const existingProfile = await User.findOne({ email, _id: { $ne: id } });
      if (existingProfile) {
        return res.status(400).json({ error: "Email already exist" });
      }
    }
    if (latitude !== undefined && longitude !== undefined) {
      updateObject.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    console.log("updateObject", updateObject);

    let profile = await User.findOneAndUpdate(
      { _id: id },
      
      {
        $set: updateObject
      },
      {
        new: true
      }
    );

    res.json(profile);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
    console.log({ error })
  }
};

// update profile
const updateProfilePhoto = async (req, res) => {
  // #swagger.tags = ['profile']
  try {
    if (req?.files?.length) {
      let photo = req?.files?.[0];

      await uploadImages(
        [
          {
            buffer: photo?.buffer,
            name: `${Date.now()}-${photo?.originalname}`
          }
        ],
        req,
        res,
        async (error, urls) => {
          if (urls) {
            let user = req?.user?._id;
            let updated = await User.findOneAndUpdate(
              { _id: user },
              {
                $set: {
                  photo: urls?.[0]
                }
              },
              {
                new: true
              }
            );
            return res.json(updated);
          }
        }
      );
    } else ErrorHandler("Please Upload a Photo", 500, req, res);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const user = await User.findById(userId);    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.photo) {
      
      user.photo = null;
      await user.save();

      res.json({ message: 'Profile picture deleted successfully' });
    } else {
      res.status(404).json({ error: 'Profile picture not found' });
    }
  } catch (error) {
    ErrorHandler(error, 500, req, res);
    console.error({ error });
  }
};

module.exports = { getProfile, updateProfile, updateProfilePhoto,deleteProfilePicture };
