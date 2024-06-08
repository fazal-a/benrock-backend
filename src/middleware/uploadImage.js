const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand
} = require("@aws-sdk/client-s3");

exports.uploadImages = async (files, req, res, next) => {
  try {
    if (files?.length) {
      const images = files;

      const imagesUrl = [];
      const s3 = new S3Client({
        endpoint: "https://s3.us-west-002.backblazeb2.com",
        region: "us-west-002",
        credentials: {
          accessKeyId: "0028aca3e67f6db0000000002",
          secretAccessKey: "K002WmPBidpTgcmAYEFORBJCJ/+JPXY"
        }
      });

      //   try {
      //     await s3.send(new CreateBucketCommand({ Bucket: "socio-bucket" }));
      //   } catch (error) {
      //     res.status(500).json({
      //       message: error.toString()
      //     });
      //   }

      images.forEach(async (item) => {
        const params = {
          Bucket: "benrock",
          Key: item?.name,
          Body: item.buffer
        };

        console.log("item", item);

        await s3
          .send(new PutObjectCommand({ ...params }))
          .then((response) => {
            if (response) {
              console.log("response", response);
              imagesUrl.push(item?.name);
              if (imagesUrl.length == images.length) {
                req.awsImages = imagesUrl;
                next(null, imagesUrl);
              }
            }
          })
          .catch((error) => {
            res.status(500).json({
              message: error.toString()
            });
          });
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
