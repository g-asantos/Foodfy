const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "23eb39e55e39ed",
    pass: "91808f4c00be42"
  }
});


