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
        endpoint: "https://s3.us-east-005.backblazeb2.com",
        region: "us-east-005",
        credentials: {
          accessKeyId: "005326224938cc50000000001",
          secretAccessKey: "K0057EaMD5KCQwqPe+Hn21JoCknftiA"
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
          Bucket: "social-app-project",
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
