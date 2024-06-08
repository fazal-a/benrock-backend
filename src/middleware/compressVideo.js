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
        endpoint: "https://s3.us-west-002.backblazeb2.com",
        region: "us-west-002",
        credentials: {
          accessKeyId: "0028aca3e67f6db0000000002",
          secretAccessKey: "K002WmPBidpTgcmAYEFORBJCJ/+JPXY"
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
              Bucket: 'benrock',
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
