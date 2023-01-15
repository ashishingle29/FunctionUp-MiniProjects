const slotModel = require("../model/slotmodel");
const userModel = require("../model/usermodel");




const adminlogin = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter mobile & password to login !" }) }

        let { Mobile, Password } = data

        if (!Mobile) { return res.status(400).send({ status: false, message: "Mobile is mandatory !" }) }
        if (!isValidMobile(Mobile)) { return res.status(400).send({ status: false, message: "Please enter valid Mobile number !" }) }

        let uniMobile = await userModel.findOne({ Mobile: Mobile })
        if (!uniMobile) { return res.status(404).send({ status: false, message: "Number not resisterd, Please resister !" }) }

        if (!Password) { return res.status(400).send({ status: false, message: "Password is mandatory !" }) }
        if (!validPassword(Password)) { return res.status(400).send({ status: false, message: "Please enter valid password !" }) }

        let result = uniMobile.Password == Password

        if (!result) { return res.status(400).send({ status: false, message: "Enter correct password !" }) }

        let token = jwt.sign({ userId: uniMobile._id }, "vacadmin vaccinecine", { expiresIn: "100h" })

        res.status(200).send({ status: true, message: "Success", token: token })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





const createslot = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter start and end time of slot !" }) }

        let { slotStartAt, slotEndAt } = data

        let date = new Date().toDateString()

        if (!slotStartAt) { return res.status(400).send({ status: false, message: "slotStartAt time is mandatory !" }) }

        let check = await slotModel.findOne({ slotStartAt: slotStartAt, Date: date })
        if (check) { return res.status(400).send({ status: false, message: "This time slot for today already created !" }) }

        if (!slotEndAt) { return res.status(400).send({ status: false, message: "Mobile is mandatory !" }) }

        let diff = slotStartAt.slice(3, 5) - slotEndAt.slice(3, 5)
        if (diff < 0) { diff = diff * (-1) }
        if (diff != 30) { return res.status(400).send({ status: false, message: "Duration of slot must be 30 min !" }) }

        data.Date = date
        data.Duration = "30 Min"
        data.firstDose = 10
        data.secondDose = 10

        let result = await slotModel.create(data)

        res.status(201).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




const getUserDetailsByFilter = async (req, res) => {
    try {
        let data = req.query

        let options = {}
        if (data.Age) { options.Age = data.Age }
        if (data.Pincode) { options.Pincode = data.Pincode }
        if (data.vaccineStatus) { options.vaccineStatus = data.vaccineStatus }

        let result = await userModel.find(options)
        if (result.length == 0) { return res.status(404).send({ status: false, message: "No User found !" }) }
        res.status(200).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





const registeredslot = async (req, res) => {
    try {
        let data = req.query

        let date = new Date().toLocaleDateString()

        let options = { resisteredTimeSlot: { $regex: date } }
        if (data) {
            if (data.vaccine == 1) { options.vaccineStatus = "first dose" }
            else if (data.vaccine == 2) { options.vaccineStatus = "second dose" }
        }
       
        let result = await userModel.find(options)

        if (result.length == 0) { return res.status(404).send({ status: false, message: "No user resistered !" }) }

        res.status(200).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { adminlogin, createslot, getUserDetailsByFilter, registeredslot } 