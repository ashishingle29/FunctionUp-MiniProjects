const mongoose = require("mongoose")

const slotSchema = new mongoose.Schema(
    {
        Date: { type: Date, required: true },
        slotStartAt: { type: String, require: true },
        slotEndAt: { type: String, require: true },
        Duration: { type: String, required: true },
        firstDose: { type: Number, required: true },
        secondDose: { type: Number, required: true }
    }
)


module.exports = mongoose.model("Slot", slotSchema)