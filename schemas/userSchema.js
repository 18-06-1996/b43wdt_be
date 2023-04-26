const mongoose = require('mongoose')
const validator = require('validator')

let userSchema = new mongoose.Schema(
    {
        name: { type: String,
             required: true },
        email: {
            type: String, 
            required: true, 
            lowercase: true,
            validate: (value) => {
                return validator.isEmail(value)
            }
        },
        mobile:{
            type:String,
            default:000-000-0000},
        password:{
            type:String,
            required:true},
        role:{
            type:String,
            default:'user'},
        cretedAt:{
            type:Date,
            default:Date.now}

    },{
       
        versionKey:false
    }
)


const userModel = mongoose.model('users',userSchema)

module.exports={userModel}