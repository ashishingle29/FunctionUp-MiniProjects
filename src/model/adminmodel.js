const mongoose = require('mongoose')

module.exports = mongoose.model(

    "admin",

    new mongoose.Schema({
        
        admin: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        }
    })
)
