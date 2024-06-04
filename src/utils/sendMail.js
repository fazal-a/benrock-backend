const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendgridTransport = require("nodemailer-sendgrid-transport");
dotenv.config({ path: "./src/config/config.env" });
const { createTransport } = nodemailer;

const sendMail =  (email, subject, text) => {
  return new Promise(async(resolve,reject)=>{
  console.log("🚀 ~ file: sendMail.js:8 ~ sendMail ~ email:1",)
   const transport = createTransport(
     sendgridTransport({
       auth: {
         api_key: process.env.NODEMAILER_API_KEY,
       },
     })
   );
   console.log("🚀 ~ file: sendMail.js:8 ~ sendMail ~ email:1",)
   await transport.sendMail({
     from: "info@rmstechknowledgy.com",
     to: email,
     subject,
     text,
   })
   .then((result) => {
     console.log("🚀 ~ file: sendMail.js:25 ~ .then ~ result:", result)
    return resolve(result)
   	}).catch((err) => {
     	console.log("🚀 ~ file: sendMail.js:27 ~ .then ~ err:", err)
    	return reject(err)
   	
   })

 })

  console.log("🚀 ~ file: sendMail.js:8 ~ sendMail ~ email, subject, text:", email, subject, text)
};

module.exports = sendMail;
