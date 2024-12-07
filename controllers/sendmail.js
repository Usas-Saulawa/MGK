// Requesting 
const bcrypt = require('bcryptjs')

//requesting enviromental variables
require('dotenv').config()

// importing unique string

// Nodemailer stuff
const Nodemailer = require('nodemailer')

const transporter = Nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

console.log(transporter.options)
transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log(success)
        console.log('Email verified')
    }
})





