const router = require('express').Router()


//requesting the controller function
const registerStudent = require('../controllers/registerstudent')
const logStudent = require('../controllers/logstudent')
const authStudent = require('../controllers/authstudent')
const otpVerify = require('../controllers/otpVerify')
const studentPortal = require('../controllers/studentPortal')

// Setting up routes
// The route for creating a new student
router.post('/registerfreshstudent', registerStudent)

// The routes for logging a student in
router.post('/login', logStudent)

// The route for verifying OTP
router.post('/verifyotp', otpVerify)

// The route for sending OTP file
router.get('/portal/:jambNo', studentPortal)

//The route for sending email otp
router.get('/authenticated/:uniqueString/:jambNo', authStudent)


module.exports = router