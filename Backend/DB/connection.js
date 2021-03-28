const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const URI = "mongodb+srv://dbUser:resUbd@cluster0.prayf.mongodb.net/MyDB?retryWrites=true&w=majority"

const connectDB = () => {
    mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false,  useUnifiedTopology: true }) //usefindandmodify to remove mongoose warning
    mongoose.connection.once("open", () => {
        console.log("Connection to database established")
    })
}

module.exports = connectDB