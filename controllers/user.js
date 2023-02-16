const bodyParser = require('body-parser');
const User = require('../models/user');
require("dotenv").config();

const bcrypt = require('bcrypt'); // It is  one way encryption
const jwt = require('jsonwebtoken');

function isstringinvalid(string){
  if(string == undefined || string.length === 0){
      return true;
  } else {
      return false;
  }      
}

function generateAccessToken(id, name) {
  return jwt.sign({ userId : id , name: name}, process.env.TOKEN_SECRET);
}

exports.postSignUpDetails = async (req, res) => {
  try{
    const { name, email, password, phNo } = req.body;
    //console.log('email : ',email);
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) || isstringinvalid(phNo)){
            return res.status(400).json({err: 'Bad parameters. Something is missing', success: false});
        }

  const saltround = 10;      
  bcrypt.hash(password, saltround, async (err, hash) =>{
    console.log(err);
    const user = await User.findAll({where: {email: email }}); 
    //console.log(user);
      if(user.length > 0){
        res.status(200).json({message : 'User already exist'});
      } else{
              //console.log(req.body);
              const data = await User.create({name:name, email:email, password:hash, phNo:phNo });
              res.status(201).json({message: 'Successfully created new user'});
            }
  })
 
  } catch(err){
    console.log(err);
    res.status(500).json({error:err});
  }
};

exports.postLoginDetails = async (req, res) => {
  try{
        const { email, password } = req.body;

        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message: 'EmailId or Password is missing', success: false});
        }
        const user = await User.findAll({where: {email: email }}); 
       // console.log(user);
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, async (err, result) => {
                if(err){
                    return res.status(500).json({ success: false, message : 'Something went wrong'}); 
                }
                if(result === true){ 
                    return res.status(201).json({ success: true, message: 'Login Successful', token : generateAccessToken(user[0].id, user[0].name)});
                } else {
                    return res.status(401).json({ success: false, message : 'Password is incorrect'});
                }
            })
        } else {
           return res.status(404).json({ success: false, message : 'User does not exist'});
        }
  } catch(err){
        console.log(err);
        res.status(500).json({error:err, success: false});
  }
};