const path = require('path')
// importing express js
const express = require('express')
const app = express()

// importing the database connection
require('./config/database')

//importing the router
const StudentsRoute = require('./routes/students')

app.use(express.json())
app.use(express.static('./public'))
app.use('/ug', StudentsRoute)
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname, 'public', 'index.html')))
})
app.get('/ug/verifyotp', (req, res) => {
    res.sendFile(path.join(path.resolve(__dirname, 'public', 'otp.html')))
})
app.all('*', (req, res) => {
    res.redirect('/')
})


app.listen(5000, () => {
    console.log('Server is active')
})