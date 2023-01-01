const mongoose = require('mongoose')

let ObjId = mongoose.Schema.Types.ObjectId

module.exports = mongoose.model(

    "slot",

    new mongoose.Schema(
        {
            date: {
                type: String
            },
            time: {
                type: String
            },
            userId: {
                type: [ObjId],
                ref: 'user'
            }

        }, { timestamps: true }
    )
)