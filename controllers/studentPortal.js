const Student = require('../models/students')


const studentPortal = (req, res) => {
    const { jambNo } = req.params
    checkAndSend
    async function checkAndSend() {
        try {
            if (jambNo) {
                const result = await Student.find({ jambNo })
                if (result.length > 0) {
                    const { authenticated } = result[0]
                    if (authenticated) {
                        res.send(`Welcome ${jambNo}`)
                        await Student.updateOne({ jambNo }, { authenticated: false })
                    }
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'The records for this student does not exist!'
                    })
                }
            } else {
                res.redirect('/')
            }
        } catch (error) {
            console.log('Problem with checking authentication')
        }
    }
}


module.exports = studentPortal