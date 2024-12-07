const bcrypt = require('bcryptjs')

const studentverificationOTP = require('../models/studentverifiicationOTP')
const Student = require('../models/students')

const otpVerify = (req, res) => {
    const { otp, jambNo } = req.body
    //const { jambNo } = req.params

    if (!otp) {
        res.json({
            status: 'FAILED',
            message: 'empty otp input!'
        })
    } else {
        checkOtpVerif()
        async function checkOtpVerif() {
            try {
                const data = await studentverificationOTP.find({ jambNo })
                if (data.length > 0) {
                    const { expiresAt } = data[0]
                    if (expiresAt < Date.now()) {
                        await studentverificationOTP.deleteMany({ jambNo })
                    } else {
                        const hashBool = await bcrypt.compare(otp, data[0].OTP)
                        if (hashBool) {
                            await Student.updateOne({ jambNo }, { authenticated: true })
                            await studentverificationOTP.deleteMany({ jambNo })
                            res.json({
                                status: 'SUCCESS',
                                message: 'Student has been authenticated successfully'
                            })
                        } else {
                            res.json({
                                status: 'FAILED',
                                message: 'Incorrect OTP! Check your inbox'
                            })
                        }
                    }
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'The records for this OTP does not exist. Try login in again!'
                    })
                }
            } catch (error) {
                console.log('Problem dey\n', error)
            }
        }
    }
}

module.exports = otpVerify