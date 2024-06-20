require("dotenv").config();
const nodemailer = require("nodemailer");

// const sendEmailer = async (option) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_FOR_USER,
//       pass: process.env.EMAIL_PASSWROD,
//     },
//   });


const sendEmailer = async (option) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:  process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASSWROD,
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  //defined emai option
  const emailOption = {
    from: "Sasatee support<support@sasatee.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(emailOption);
};

module.exports = sendEmailer;
