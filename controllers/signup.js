const bodyParser = require('body-parser');
const User = require('../models/signup');

const bcrypt = require('bcrypt');

function isstringinvalid(string){
  if(string == undefined || string.length === 0){
      return true;
  } else {
      return false;
  }      
}

exports.postSignUpDetails = async (req, res) => {
  try{
    const { name, email, password, phNo } = req.body;
    console.log('email : ',email);
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) || isstringinvalid(phNo)){
            return res.status(400).json({err: 'Bad parameters. Something is missing', success: false});
        }

  const saltround = 10;      
  bcrypt.hash(password, saltround, async (err, hash) =>{
    console.log(err);
    const user = await User.findAll({where: {email: email }}); 
    console.log(user);
      if(user.length > 0){
        res.status(200).json({message : 'User already exist'});
      } else{
              console.log(req.body);
              const data = await User.create({name:name, email:email, password:hash, phNo:phNo });
              res.status(201).json({message: 'Successfully created new user'});
            }
  })
 
  } catch(err){
    console.log(err);
    res.status(500).json({error:err});
  }
};