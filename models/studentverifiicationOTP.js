const mongoose = require('mongoose')

const studentverificationOTP = new mongoose.Schema({
    jambNo: String,
    OTP: String,
    createdAt: Date,
    expiresAt: Date
})


module.exports = mongoose.model('studentverificationotp', studentverificationOTP)