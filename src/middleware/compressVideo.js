const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const { Readable } = require("stream");
exports.uploadCompressedVideosWithThumbnail = async (files, req, res, next) => {
  try {
    if (files?.length) {
      const videos = files;
      const videoUrls = [];
      const s3 = new S3Client({
        endpoint: "https://s3.us-east-005.backblazeb2.com",
        region: "us-east-005",
        credentials: {
          accessKeyId: "005326224938cc50000000001",
          secretAccessKey: "K0057EaMD5KCQwqPe+Hn21JoCknftiA"
        }
      });

      await Promise.all(
        videos.map(async (item) => {
          const fileName = item.name.split(".")[0];
          const compressedFileName = `compress-${fileName}.mp4`;
          const thumbnailFileName = `thumbnail-${fileName}.png`;

          // Use fluent-ffmpeg to compress the video
          const videoBuffer = await new Promise((resolve, reject) => {
            const videoStream = Readable.from([item?.buffer]);
            const buffers = [];
            videoStream.on('data', (chunk) => buffers.push(chunk));
            videoStream.on('end', () => resolve(Buffer.concat(buffers)));
            videoStream.on('error', reject);
          });

          try {
            // Upload compressed video to S3
            const videoParams = {
              Bucket: 'social-app-project',
              Key: compressedFileName,
              Body: videoBuffer,
            };
            const videoResponse = await s3.send(new PutObjectCommand(videoParams));
            console.log('Video upload response', videoResponse);
            videoUrls.push(compressedFileName);
          } catch (error) {
            console.log('Video S3 upload error', error);
            res.status(500).json({
              message: error.toString(),
            });
          }

          // Add your thumbnail generation logic here (uncomment it and adapt as needed)

        })
      );

      req.awsVideos = videoUrls;
      next(null, {
        videos: videoUrls,
        thumbnails: videoUrls?.map(() => ''),
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};
