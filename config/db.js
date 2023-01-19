const mongoose = require('mongoose')
require('dotenv').config()

let connection = mongoose.connect(`${process.env.mongoUrl}/test`)

module.exports = connection
