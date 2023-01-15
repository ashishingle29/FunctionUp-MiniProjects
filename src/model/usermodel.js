const {Schema, model} = require("mongoose")

const userSchema = new Schema(
    {
        Name : {type:String, required:true},
        Mobile : {type:String, required:true, unique:true},
        Age:{type:Number, required:true},
        Password:{type:String, required:true},
        Pincode:{type:Number, required:true},
        Aadhar:{type:String, required:true, unique:true},
        vaccineStatus:{
            type:String,
            default:"none"
        },
        resisteredTimeSlot :{type:String},
        resisteredAt:{type:String}
    }
)

module.exports = model("UserData", userSchema)