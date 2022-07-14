const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const UserModel = mongoose.model('UserModel');
const bcrypt = require('bcryptjs');
const JWT= require('jsonwebtoken');
const {JWT_SECRET}=require('../config');

const protectedResource = require('../middleware/protectedResource');


router.get("/",(req,res)=>{
    res.send("Welcome to ISTA BLOG !");

});

router.get("/secured",protectedResource,(req,res)=>{
    res.send("Welcome to secured area !");

});


router.post('/login', (req,res)=>{
    const {email,password}= req.body;
    if( !email || !password ){
        return res.status(400).json({error:"one or more mandatory field is empty"});  
    }
    UserModel.findOne({email:email})
    .then((dbUser)=>{
        if(!dbUser){ //User not found
            return res.status(400).json({error:"Invalid credentials!"});  

        }
        bcrypt.compare(password, dbUser.password)
        .then((didMatch)=> {
            if(didMatch){
                //return res.status(201).json({error:"User Logged In successfully"});  
                // creat and send a token
                const jwtToken = JWT.sign({ _id:dbUser._id}, JWT_SECRET);
                res.json({ token: jwtToken });

            } else {
                return res.status(400).json({error:"Invalid credentials!"});  
            }
        });
    })
    .catch((error)=> {
        console.log(error);
    });
});



router.post('/register', (req,res)=> {
    console.log(req.body);
    const { fullName,email,password }=req.body;//object destructuring
    const user = '';
    if(!fullName || !password|| !email ) {
       return res.status(400).json({error:"one or more mandatory field is empty"});   
  }

  //avoid duplicate user
  UserModel.findOne({email:email})
  .then((dbUser)=> {
    if(dbUser){
        return res.status(500).json("{error:User with email already exist}");   
    }
    bcrypt.hash(password, 16)
    .then((hashedPassword) => {
        const user = new UserModel({ fullName, email, password: hashedPassword, profilePicUrl: profilePicUrl });
        user.save()
            .then((u) => {
                res.status(201).json({ result: "User Registered successfully" });
            })
            .catch((error) => {
                console.log(error);
            });
    });

    })
    .catch((error) => {
   console.log(error);
    });
});

module.exports = router;