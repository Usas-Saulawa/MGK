const path = require('path')

// Requesting the students model
const Student = require('../models/students')
const Studentverification = require('../models/studentverification')


// Importing bcrypt stuff
const bcrypt = require('bcryptjs')

const nodemailer = require('nodemailer')
const transporter = require('./nodemailer')

//generating a unique string to store in the database
const { v4: uuidv4 } = require('uuid')

// Importing email verifier

const registerStudent = (req, res) => {
    let { firstName, lastName, email, password, jambNo } = req.body
    /*
    firstName = firstName.trim()
    lastName = lastName.trim()
    email = email.trim()
    password = password.trim()
    jambNo = jambNo.trim()
    */

    if (firstName == '' || lastName == '' || email == '' || jambNo == '') {
        res.json({
            status: 'FAILED',
            message: 'empty input fields'
        })
    } else if (!/^[a-zA-Z]*$/.test(firstName)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid first name'
        })
    } else if (!/^[a-zA-Z]*$/.test(lastName)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid first name'
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: 'FAILED',
            message: 'Invalid email'
        })
    } else if (password.length < 8) {
        res.json({
            status: 'FAILED',
            message: 'Password is too short'
        })
    } else {
        checkStudentRecord()
        async function checkStudentRecord() {
            try {
                // checking if the student already exist
                const result = await Student.find({ jambNo, firstName })
                console.log(result);
                if (result.length) {
                    res.json({
                        status: 'FAILED',
                        message: 'Student already exist'
                    })
                } else {
                    // Create a new student
                    const saltRounds = 10
                    const hashedPassword = await bcrypt.hash(password, saltRounds)

                    const newStudent = new Student({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        jambNo,
                    })
                    const result = await newStudent.save()
                    console.log('this is the result', result);
                    sendEmailVerification(result, res)
                    async function sendEmailVerification({ jambNo, email }, res) {
                        try {
                            const currentSite = 'http://localhost:5000'

                            const uniqueString = uuidv4() + jambNo
                            console.log('This the unique string>>\n', uniqueString);
                            const saltRounds = 10
                            const mailOptions = {
                                from: process.env.AUTH_EMAIL,
                                to: email,
                                subject: 'Verify your email',
                                html: `<p>Verify your email via the link below to complete the signup process</p><br>
                                        <p>This link expires in 10 minutes <b>Press</b> <a href='${currentSite + '/ug/registerfreshstudent/' + uniqueString + '/' + jambNo}'>here</a></p>`
                            }

                            const hashedString = await bcrypt.hash(uniqueString, saltRounds)

                            const newStudentVerificationRecord = new Studentverification({
                                jambNo,
                                uniqueString: hashedString,
                                createdAt: Date.now(),
                                expiresAt: Date.now() + 1800000
                            })
                            await newStudentVerificationRecord.save()
                            console.log('this is the new student', newStudentVerificationRecord)

                            await transporter.sendMail(mailOptions)


                            res.sendFile(path.join(path.resolve(__dirname, 'public', 'index.html')))


                        } catch (error) {
                            console.log(error);
                        }
                    }
                    res.json({
                        status: 'SUCCESS',
                        message: 'Student information stored successfully'
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
module.exports = registerStudent