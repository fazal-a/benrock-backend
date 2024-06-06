const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const sendgridTransport = require("nodemailer-sendgrid-transport");
dotenv.config({ path: "./src/config/config.env" });
const { createTransport } = nodemailer;

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.NODEMAILER_API_KEY,
        },
    })
);

const sendMail = async (email, subject, textMessage, htmlContent) => {
    try {

        await transporter.sendMail({
            from: "fazal.a@pacsquare.com",
            to: email,
            subject: subject,
            text: textMessage,
            html: htmlContent,
        });
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};


module.exports = sendMail;
