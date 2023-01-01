const userModel = require('../model/usermodel')
const adminModel = require('../model/adminModel')
const jwt = require('jsonwebtoken')


const createUser = async function(req,res){
    try {
        const data = req.body
        const register = await userModel.create(data)
        return res.status(201).send({status:true,msg:"you are now registerd",details:register})
    } catch (err) {
        return res.status(500).send({status:false,error:err.msg})
    }
}






const login = async function (req, res) {
    try {
        const data = req.body
        let { phoneNumber, password, admin } = data
        let func=(num)=>{
            let token = jwt.sign({ phoneNumber: num }, "Anand Kumar")
            return token
        }
        if (admin) {
            if (!password) {
                return res.status(400).send({ status: false, msg: "password is required" })
            }
            let findAdmin = await adminModel.findOne({ admin: admin, password: password })
            if (!findAdmin) {
                return res.status(400).send({ status: false, msg: "Not Authorized for this Operation" })
            }
            return res.status(201).send({ status: true, msg: "login successful", token: func(phoneNumber) })
        }
        if (!admin) {
            if (!phoneNumber) {
                return res.status(400).send({ status: false, msg: "Phone Number is required" })
            }
            if (!password) {
                return res.status(400).send({ status: false, msg: "password is required" })
            }
            let userExist = await userModel.findOne({ phoneNumber: phoneNumber, password: password })
            if (!userExist) {
                return res.status(404).send({ status: false, msg: "phoneNumber and password is incorrect" })
            }
            return res.status(201).send({ status: true, msg: "login succesfull", token: func(phoneNumber) })
        }
    } catch (err) {
        return res.status(500).send({ status: false, error: err.msg })
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


const getUserDetailsByFilter = async function (req, res) {
    try {
        let data = req.query
        let findUser = await userModel.find(...data)
        return res.status(200).send({ status: true, msg: "all users", dataCount: findUser.length, data: findUser })
    } catch (err) {
        return res.status(500).send({ status: false, error: err.msg })
    }
}





module.exports= {createUser,login,getUserDetails,getUserDetailsByFilter}