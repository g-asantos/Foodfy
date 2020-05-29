const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1f8b2ac919608e",
    pass: "52f6f3c6979541"
  }
});


