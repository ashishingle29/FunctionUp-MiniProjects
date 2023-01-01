const UserModel = require('../model/usermodel')
const SlotModel = require('../model/slotmodel')

exports.bookSlot = async (req, res) => {
    try {
        let data = req.body
        let {id, date, time} = data

        let user = await UserModel.findById(id)

        if (!user) return res.status(404).send({status: false, message: 'User id not found'})

        //todo need to check if the date is past or future && valid

        let checkSlot = await SlotModel.findOne({date: date, time: time})

        if (checkSlot.userId.length > 10) {
            return res.status(400).send({status: false, message: 'This time slot is already booked, try to book another slot'})
        }

        await SlotModel.updateOne({_id: checkSlot._id}, {$set: {userId: checkSlot.userId.push(id)}})

        res.status(201).send({status: false, message: 'Time slot booked, be there in time'})
    }
    catch (error) {
        res.status(500).send({status: false, message: error.message})
    }
}
