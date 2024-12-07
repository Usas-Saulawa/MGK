// Requesting the students model
const Student = require('../models/students')
const StudentverificationOTP = require('../models/studentverifiicationOTP')

// Dotenv
require('dotenv').config()

// Importing bcrypt stuff
const bcrypt = require('bcryptjs')

// Importing Nodemailer stuff

const transporter = require('./nodemailer')

const logStudent = (req, res) => {
    let { password, jambNo } = req.body

    if (password == '' || jambNo == '') {
        res.json({
            status: 'FAILED',
            message: 'empty input fields'
        })
    } else {
        // checking if the student is valid
        checkStudentRecord()
        async function checkStudentRecord() {
            try {
                const data = await Student.find({ jambNo })
                if (data.length) {
                    // Student already exist remain password check
                    const checkHash = await bcrypt.compare(password, data[0].password)
                    console.log(checkHash)
                    if (checkHash) {
                        sendStudentVerificationOTP()
                        async function sendStudentVerificationOTP() {
                            try {
                                const OTP = (Math.floor(Math.random() * 8999) + 1000)
                                const saltRounds = 10
                                console.log(OTP, 'Waiting for next action');
                                const hashedOTP = await bcrypt.hash(String(OTP), saltRounds)

                                const newStudentVerificationOTP = new StudentverificationOTP({
                                    jambNo: data[0].jambNo,
                                    email: data[0].email,
                                    OTP: hashedOTP,
                                    createdAt: Date.now(),
                                    expiresAt: Date.now() + 600000
                                })

                                const result = await newStudentVerificationOTP.save()
                                const mailOptions = {
                                    from: 'afitstudentverif@gmail.com',
                                    to: data[0].email,
                                    subject: 'AFIT STUDENT AUTHENTICATION',
                                    text: `Your One Time Password is ${OTP}\n It expires in 10 minutes.`
                                }

                                await transporter.sendMail(mailOptions)

                                res.redirect(`/ug/verifyotp`)


                            } catch (error) {
                                console.log(error);
                            }
                        }
                    } else {
                        res.json({
                            status: 'FAILED',
                            message: 'Incorrect password! try again'
                        })
                    }
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'The records for this student doesn\'t exist'
                    })
                }
            } catch (error) {
                console.log(error);
                res.json({
                    status: 'FAILED',
                    message: 'Something went wrong'
                })
            }
        }
    }
}



module.exports = logStudent