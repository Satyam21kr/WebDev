const mongoose = require('mongoose')
const { Schema } = mongoose

const XenonStackUserSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type: String
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

const XenonStackUserModel = new mongoose.model('XenonStackUserModel', XenonStackUserSchema)

module.exports = XenonStackUserModel