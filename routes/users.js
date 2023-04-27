const express = require('express');
const router = express.Router();
const {userModel} = require('../schemas/userSchema');
const mongoose = require ('mongoose');

const {hashPassword,hashCompare,createToken,validate, roleAdminGaurd} = require('../common/auth')
const {dbUrl} = require('../common/dbconfig');


mongoose.connect(dbUrl);

   
router.post('/signup', async(req,res)=>{
  try {
   let user = await userModel.findOne({email:req.body.email})
       console.log(user)
    if(!user){
      
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
       let user = await userModel.create(req.body) 
    res.status(201).send({user,message:"user signup successful"})
    }
    else
     {
      res.status(400).send({message:"user alreadt exists"})
    }
  } catch (error) {

    res.status(500).send({
      message:"internal server error"
    })
  }
  
})


router.post('/login',async(req,res)=>{
  try {
    let user = await userModel.findOne({email:req.body.email})
    if(user)
    {
      //verify the password
      if(await hashCompare(req.body.password,user.password)){
        // create the token
        let token = await createToken({
          name:user.name,
          email:user.email,
          id:user._id,
          role:user.role
        })
       
        res.status(200).send({
          message:"User Login Successfull!",
        token
        })
      }
      else
      {
        res.status(402).send({message:"Invalid Credentials"})
      }
    }
    else
    {
      res.status(400).send({message:"User Does Not Exists!"})
    }

  } catch (error) {
    res.status(500).send({message:"Internal Server Error",error})
  }
})


router.get('/', validate,roleAdminGaurd, async(req,res)=>{
  try {
    let users = await userModel.find({},{password:0})
    res.status(200).send({users,message:"users details"})
    
  } catch (error) {
    res.status(500).send({
      message:"internal server error"
    }),
    error
    
  }
})

router.get('/:id', async(req,res)=>{
  try {
    let users = await userModel.findOne({_id:req.params.id})

    res.status(200).send({users,message:"users details"})
    
  } catch (error) {
    res.status(500).send({
      message:"internal server error"
    }),
    error
    
  }
})

router.delete('/:id', async(req,res)=>{
  try {
   let user = await userModel.findOne({_id:req.params.id})
       console.log(user)
    if(user){
       let user = await userModel.deleteOne({_id:req.params.id}) 
    res.status(201).send({message:"user data deleted successful"})
    }
    else
     {
      res.status(400).send({message:"user data not found"})
    }
  } catch (error) {

    res.status(500).send({
      message:"internal server error"
    })
  }
  
})

router.put('/:id', async(req,res)=>{
  try {
   let user = await userModel.findOne({_id:req.params.id})
       console.log(user)
    if(user){
      
      user.name= req.body.name
      user.email= req.body.email
      user.password= req.body.password
      user.role=req.body.role

      await user.save()

    res.status(201).send({user,message:"user data updated successful"})
    }
    else
     {
      res.status(400).send({message:"user dose not exists"})
    }
  } catch (error) {

    res.status(500).send({
      message:"internal server error"
    }), error
  }
  
})



module.exports=router