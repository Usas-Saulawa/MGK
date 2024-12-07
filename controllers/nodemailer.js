const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    logger: true,
    secure: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: 'qqlifqmneephmhgo'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter