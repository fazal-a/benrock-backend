const Attachment = require("../models/attachment");
const User = require("../models/user");
const { ErrorHandler } = require("../utils/ErrorHandler");
const { SuccessHandler } = require("../utils/SuccessHandler");
const { uploadImages } = require("../middleware/uploadImage");
const {
  uploadCompressedVideosWithThumbnail
} = require("../middleware/compressVideo");

// upload photo
const uploadPhoto = async (req, res) => {
  // #swagger.tags = ['photo']
  try {
    console.log("🚀 ~ file: attachmentController.js:44 ~ videos ~ req?.files:", req?.files)
    if (req?.files?.length) {
      if (!req?.body?.type)
        return ErrorHandler("Please mention type in data", 500, req, res);

      if (req?.body?.type === "photo") {
        let images = req?.files?.map((value) => ({
          buffer: value?.buffer,
          name: `${Date.now()}-${value?.originalname}`
        }));

        await uploadImages(images, req, res, async (error, urls) => {
          if (urls) {
            let user = req?.user?._id;

            let insert = urls?.map((value) => ({
              createdBy: user,
              path: value,
              type: req?.body?.type,
              clicks: 0,
              likes:0,
            }));
            let inserted = await Attachment.insertMany(insert);
            if (inserted)
              SuccessHandler(
                { message: "Attachment uploaded successfully" },
                200,
                res
              );
          }
        });
      } else {
        let videos = req?.files?.map((value) => ({
          buffer: value?.buffer,
          name: `${Date.now()}-${value?.originalname}`
        }));

        await uploadCompressedVideosWithThumbnail(
          videos,
          req,
          res,
          async (error, urls) => {
            if (urls?.videos) {
              let user = req?.user?._id;

              let insert = urls?.videos?.map((value, index) => ({
                createdBy: user,
                path: value,
                type: req?.body?.type,
                thumbnail: urls?.thumbnails[index],
                clicks: 0,
                likes:0,
              }));
              let inserted = await Attachment.insertMany(insert);
              if (inserted)
                SuccessHandler(
                  { message: "Attachment uploaded successfully" },
                  200,
                  res
                );
            } else {
              return ErrorHandler(
                "Some problem at getting urls.",
                500,
                req,
                res
              );
            }
          }
        );
      }
    } else ErrorHandler("Please attach attachment.", 500, req, res);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};

const addClick = async (req, res) => {
  // #swagger.tags = ['photo']

  try {
    const attachmentId = req.params.attachmentId;

    // Find the attachment by ID and increment the clicks count
    const updatedAttachment = await Attachment.findByIdAndUpdate(
      attachmentId,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!updatedAttachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    res.json(updatedAttachment);
  } catch (error) {
    console.error(error);
    ErrorHandler(error, 500, req, res);
  }
};

const getAttachmentsByUser = async (req, res) => {
  // #swagger.tags = ['photo']
  try {
    let attachments = await Attachment.find({
      createdBy: req?.query?.user || req?.user?._id
    });
    if (attachments) SuccessHandler(attachments, 200, res);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};

const getNearByAttachments = async (req, res) => {
  // #swagger.tags = ['photo'];

  try {
    let { location } = req?.user,
      radiusInMiles = 100;
    let longitude = location?.coordinates?.[0],
      latitude = location?.coordinates?.[1];

    let nearestAttachments;
    if (latitude && longitude) {
      const nearbyUsers = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: parseFloat(radiusInMiles) * 1609.34 // convert to meters
          }
        }
      }).select("_id");

      nearestAttachments = await Attachment.find({
        createdBy: { $in: nearbyUsers?.map((v) => v?._id) },
        createdAt: { $gte: new Date().setUTCHours(0, 0, 0, 0) } // Filter for attachments created today
      })
        .sort({ clicks: -1, createdAt: -1 })
        .populate("createdBy", "name email photo");
    } else {
      nearestAttachments = await Attachment.find({
        createdAt: { $gte: new Date().setUTCHours(0, 0, 0, 0) } // Filter for attachments created today
      })
        .sort({ clicks: -1, createdAt: -1 })
        .populate("createdBy", "name email photo");

    }
    res.json(nearestAttachments);
  } catch (error) {
    console.error(error);
    ErrorHandler(error, 500, req, res);
  }
};

const getRecentAttachments = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const skip = (page - 1) * limit;

  try {
    const attachments = await Attachment.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email photo')
      .lean();  // Add .lean() to get plain JavaScript objects instead of Mongoose documents

    const total = await Attachment.countDocuments();

    res.status(200).json({
      status: "success",
      data: attachments.map(attachment => ({
        ...attachment,
        clicks: attachment.clicks || 0,
        likes: attachment.likes || 0
      })),
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching paginated attachments:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while retrieving paginated attachments",
    });
  }
};

const getRecentFeed = async (req, res) => {
  // #swagger.tags = ['photo'];

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const skip = (page - 1) * limit;
  const radiusInMiles = 100;

  try {
    let { location } = req.user;
    let longitude = location?.coordinates?.[0];
    let latitude = location?.coordinates?.[1];

    let nearbyAttachments = [];
    let otherAttachments = [];
    let nearbyUsers = [];

    if (latitude && longitude) {
      nearbyUsers = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: parseFloat(radiusInMiles) * 1609.34 // convert to meters
          }
        }
      }).select("_id");

      console.log("----i am in recentFeed with nearbyUsers::::", nearbyUsers);

      nearbyAttachments = await Attachment.find({
        createdBy: { $in: nearbyUsers.map(v => v._id) },
        createdAt: { $gte: new Date().setUTCHours(0, 0, 0, 0) } // Filter for attachments created today
      })
          .sort({ createdAt: -1 })
          .populate("createdBy", "name email photo")
          .lean();
    }

    // Fetch remaining attachments
    otherAttachments = await Attachment.find({
      createdBy: { $nin: nearbyUsers.map(v => v._id) }, // Exclude nearby users' attachments
      createdAt: { $gte: new Date().setUTCHours(0, 0, 0, 0) } // Filter for attachments created today
    })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email photo")
        .lean();

    // Combine both lists
    let allAttachments = nearbyAttachments.concat(otherAttachments);

    // Pagination logic
    const total = allAttachments.length;
    const paginatedAttachments = allAttachments.slice(skip, skip + limit);

    res.status(200).json({
      status: "success",
      data: paginatedAttachments.map(attachment => ({
        ...attachment,
        clicks: attachment.clicks || 0,
        likes: attachment.likes || 0
      })),
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.log("----i am in recentFeed with error::::", error);
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error while retrieving recent feed",
    });
  }
};


const getPopularAttachments = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const skip = (page - 1) * limit;

  try {
    const attachments = await Attachment.find({ likes: { $gt: 0 } })
        .sort({ likes: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email photo')
        .lean();  // Add .lean() to get plain JavaScript objects instead of Mongoose documents

    const total = await Attachment.countDocuments({ likes: { $gt: 0 } });

    res.status(200).json({
      status: "success",
      data: attachments.map(attachment => ({
        ...attachment,
        clicks: attachment.clicks || 0,
        likes: attachment.likes || 0
      })),
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching paginated attachments:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while retrieving paginated attachments",
    });
  }
};



// export default { uploadPhoto, getAttachmentsByUser };
module.exports = {
  uploadPhoto,
  getAttachmentsByUser,
  getNearByAttachments,
  addClick,
  getRecentAttachments,
  getPopularAttachments,
  getRecentFeed
};
