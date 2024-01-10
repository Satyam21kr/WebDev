const mongoose = require('mongoose')
const { Schema } = mongoose

const XenonStackContactSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    message : {
        type : String,
    }
})

const XenonStackContactModel = new mongoose.model('XenonStackContactModel', XenonStackContactSchema)

module.exports = XenonStackContactModel