const mongoose = require("mongoose")


const studentOTPVerificationSchema = new mongoose.Schema({
    jambNo: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
})

module.exports = mongoose.model('studentverification', studentOTPVerificationSchema)