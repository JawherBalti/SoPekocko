const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./DB/connection')
const userRoute = require('./route/user')
const sauceRoute = require('./route/sauce')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const fs = require('fs')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// Log toutes les requêtes passées au serveur
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
// Sécuriser les headers
app.use(helmet())

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/auth", userRoute)
app.use("/api/sauces", sauceRoute)

connectDB()

const Port = process.env.Port || 3000

app.listen(Port, () => console.log(`Server is running on port ${Port}`))