const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()
const app_password = process.env.app_password

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "oluwaseunadesina8@gmail.com",
      pass: app_password,
    },
});

module.exports = transporter