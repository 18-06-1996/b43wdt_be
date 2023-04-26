
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
// const secretKey ='asdfdfmkldjfiewtoehf'
const saltRounds=10;
const {token}=require('morgan')

const hashPassword = async(password)=>{
  let salt = await bcrypt.genSalt(saltRounds)
  let hashedPassword = await bcrypt.hash(password,salt)
  return hashedPassword
}

const hashCompare= async(password,hashedPassword)=>{
  return await bcrypt.compare(password,hashedPassword)
}

const createToken= async(payload)=>{
  let token = await jwt.sign(payload,process.env.secretKey,{expiresIn:'2m'})
  return token
} 


const validate = async(req,res,next)=>{
console.log(req.headers.authorization)

if(req.headers.authorization){
  let token= req.headers.authorization.split(" ")[1]
  let data= await jwt.decode(token)
  console.log(data)
  console.log(+new Date()/1000)
  if(Math.floor((+new Date()/1000))<data.exp){
    next()
  }else{
    res.status(400).send({message:"token expired"})
  }
}else{
  res.status(400).send({message:"token not found"})
}
}


const roleAdminGaurd = async(req,res,next)=>{
  console.log(req.headers.authorization)
  
  if(req.headers.authorization){
    let token= req.headers.authorization.split(" ")[1]
    let data= await jwt.decode(token)
    console.log(data)
   
    if(data.role === 'admin'){
      next()
    }else{
      res.status(400).send({message:"only Admins are allowed"})
    }
  }else{
    res.status(400).send({message:"token not found"})
  }
  }

module.exports={hashPassword,hashCompare,createToken,validate,roleAdminGaurd}