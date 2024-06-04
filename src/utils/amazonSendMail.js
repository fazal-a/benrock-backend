const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({ path: './src/config/config.env' });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

const sendMail = (email, subject, text) => {
  return new Promise(async (resolve, reject) => {
    console.log("🚀 ~ file: sendMail.js:8 ~ sendMail ~ email:1",)
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Data: text,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: 'admin@zember.lat', 
    };

    ses.sendEmail(params, (err, data) => {
      if (err) {
        console.error('Error sending email:', err);
        reject(err);
      } else {
        console.log('Email sent successfully:', data);
        resolve(data);
      }
    });
  });
};

module.exports = sendMail;
