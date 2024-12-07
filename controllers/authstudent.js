const Studentverification = require('../models/studentverification')
const Student = require('../models/students')
const bcrypt = require('bcryptjs')



const authStudent = async (req, res) => {
    try {
        let { uniqueString, jambNo } = req.params

        const result = await Studentverification.find({ jambNo })
        console.log(result[0].uniqueString)
        if (result.length > 0) {
            const { expiresAt } = result[0]
            if (expiresAt < Date.now()) {
                await Studentverification.deleteOne({ jambNo })
                await Student.deleteOne({ jambNo })
                res.json({
                    status: 'FAILED',
                    message: 'The link has already expired please sign up again'
                })
            } else {
                const hashBool = await bcrypt.compare(uniqueString, result[0].uniqueString)
                console.log(hashBool)
                if (hashBool) {
                    await Student.updateOne({ jambNo }, { verified: true })
                    await Studentverification.deleteOne({ jambNo })


                    res.redirect('/')
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'The link has been altered, check your inbox'
                    })
                }

            }

        } else {
            res.json({
                status: 'FAILED',
                message: 'The records for this email no longer exist'
            })
        }
    } catch (error) {
        console.log(error)
    }



}
module.exports = authStudent