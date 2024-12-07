const mongoose = require("mongoose")


const studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    jambNo: String,
    verified: {
        type: Boolean,
        default: false
    },
    authenticated: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('students', studentSchema)