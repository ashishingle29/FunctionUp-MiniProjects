const { isValidMobile, checkName, validPassword, isValidAge, isValidPincode, isValidAadhar } = require("../validations/validations")
const userModel = require("../model/usermodel")
const slotModel = require("../model/slotmodel")
const bcrypt = require("bcrypt")
const tc = require("time-slots-generator");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");






const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter user details !" }) }

        let { Name, Mobile, Password, Age, Pincode, Aadhar } = data

        if (!Name) { return res.status(400).send({ status: false, message: "Name is mandatory !" }) }
        if (!checkName(Name)) { return res.status(400).send({ status: false, message: "Please enter valid name !" }) }

        if (!Mobile) { return res.status(400).send({ status: false, message: "Mobile is mandatory !" }) }
        if (!isValidMobile(Mobile)) { return res.status(400).send({ status: false, message: "Please enter valid mobile number !" }) }

        let uniMobile = await userModel.findOne({ Mobile: Mobile })
        if (uniMobile) { return res.status(400).send({ status: false, message: "Mobile number already resisterd, Login !" }) }

        if (!Password) { return res.status(400).send({ status: false, message: "Password is mandatory !" }) }
        if (!validPassword(Password)) { return res.status(400).send({ status: false, message: "Please enter valid password !" }) }

        if (!Age) { return res.status(400).send({ status: false, message: "Age is mandatory !" }) }
        if (!isValidAge(Age)) { return res.status(400).send({ status: false, message: "Please enter valid age !" }) }

        if (!Pincode) { return res.status(400).send({ status: false, message: "Pincode is mandatory !" }) }
        if (!isValidPincode(Pincode)) { return res.status(400).send({ status: false, message: "Please enter valid pincode !" }) }

        if (!Aadhar) { return res.status(400).send({ status: false, message: "Aadhar number is mandatory !" }) }
        if (!isValidAadhar(Aadhar)) { return res.status(400).send({ status: false, message: "Please enter valid Aadhar number !" }) }

        let uniAadhar = await userModel.findOne({ Aadhar: Aadhar })
        if (uniAadhar) { return res.status(400).send({ status: false, message: "Aadhar number already exits !" }) }

        data.Password = await bcrypt.hash(Password, 4)

        let result = await userModel.create(data)

        res.status(201).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}






const login = async (req, res) => {
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

        let result = await bcrypt.compare(Password, uniMobile.Password)

        if (!result) { return res.status(400).send({ status: false, message: "Enter correct password !" }) }

        let token = jwt.sign({ userId: uniMobile._id }, "vaccine", { expiresIn: "100h" })

        res.status(200).send({ status: true, message: "Success", token: token })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getUserDetails = async function (res,res){
    try {
        userId = req.params.userId
        let userExist = await userModel.findOne({_id:userId})
        if (!userExist){
            return res.status(404).send({status:false,msg:"requested User not Found"})
        }
        return res.status(200).send({status:false,msg:"data fetched Successfully",data:userExist})
    } catch (err) {
        return res.status(500).send({status:false,error:err.msg})
    }
}


const getTimeSlot = async (req, res) => {
    try {
        let user = req.user;

        let selectObj = {}
        if (user.vaccineStatus == "none") { selectObj.secondDose = 0 }
        if (user.vaccineStatus == "first dose") { selectObj.firstDose = 0 }

        let date = new Date().toDateString()
        let result = await slotModel.find({ Date: date }).sort({ slotStartAt: 1 }).select(selectObj)

        if (result.length == 0) { return res.status(404).send({ status: false, message: "No times slot for today !" }) }

        res.status(200).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const bookSlot = async (req, res) => {
    try {
        let user = req.user;

        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter vaccineStatus !" }) }

        let { slotStartAt } = data
        let date = new Date().toLocaleDateString()

        if (!slotStartAt) { return res.status(400).send({ status: false, message: "slotStartAt time is mandatory !" }) }

        let check = await slotModel.findOne({ Date: date, slotStartAt: slotStartAt })
        if (!check) { return res.status(400).send({ status: false, message: `No time slot for ${slotStartAt} !` }) }

        if (user.vaccineStatus == "none") {
            if (check.firstDose == 0) { return res.status(400).send({ status: false, message: `${user.vaccineStatus} not available !` }) }
            user.vaccineStatus = "first dose"
            await slotModel.updateOne({ slotStartAt: slotStartAt }, { $inc: { firstDose: -1 } })
        }
        else if (user.vaccineStatus == "first dose") {
            if (check.secondDose == 0) { return res.status(400).send({ status: false, message: `${user.vaccineStatus} not available !` }) }
            user.vaccineStatus = "second dose"
            await slotModel.updateOne({ slotStartAt: slotStartAt }, { $inc: { secondDose: -1 } })
        }

        user.resisteredAt = Date.now()
        user.resisteredTimeSlot = `${user.vaccineStatus} on ${date} & slot at ${slotStartAt}`

        let result = await userModel.findByIdAndUpdate(user._id, user, { new: true })

        res.status(200).send({ status: true, message: "Success", data: result })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



const updateSlot = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Enter a valid  userId !" }) }

        let user = await userModel.findOne({ _id: userId }).lean()
        if (!user) { return res.status(404).send({ status: false, message: "No user found !" }) }

        if (user.resisteredAt + (24 * 60 * 60) < Date.now()) { return res.status(400).send({ status: false, message: "You can't update after 24hr !" }) }

        let data = req.body;
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter slot time to update !" }) }

        let { slotStartAt } = data

        let check = await slotModel.findOne({ Date: date, slotStartAt: slotStartAt })
        if (!check) { return res.status(400).send({ status: false, message: `No time slot for ${slotStartAt} !` }) }

        let date = new Date().toLocaleDateString()
        user.resisteredTimeSlot = `${user.vaccineStatus} on ${date} & slot at ${slotStartAt}`
        user.resisteredAt = Date.now()

        if (user.vaccineStatus == "first dose") {
            if (check.firstDose == 0) { return res.status(400).send({ status: false, message: `${user.vaccineStatus} not available !` }) }
            await slotModel.updateOne({ slotStartAt: slotStartAt }, { $inc: { firstDose: -1 } })
        }
        else if (user.vaccineStatus == "second dose") {
            if (check.secondDose == 0) { return res.status(400).send({ status: false, message: `${user.vaccineStatus} not available !` }) }
            await slotModel.updateOne({ slotStartAt: slotStartAt }, { $inc: { secondDose: -1 } })
        }

        let result = await userModel.findByIdAndUpdate(userId, user, { new: true })

        res.status(200).send({ status: true, message: "Success", data: result })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createUser, login, getUserDetails, getTimeSlot, bookSlot, updateSlot }