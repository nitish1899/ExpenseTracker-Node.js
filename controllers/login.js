const bodyParser = require('body-parser');
const User = require('../models/signup');
const Login = require('../models/login');
const bcrypt = require('bcrypt');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    } else {
        return false;
    }      
}

exports.postLoginDetails = async (req, res) => {
  try{
        // const EmailId = req.body.email; 
        // const Password = req.body.password;
        const { email, password } = req.body;

        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message: 'EmailId or Password is missing', success: false});
        }
        const user = await User.findAll({where: {email: email }}); 

        if(user.length > 0){
            bcrypt.compare(password, user[0].password, async (err, result) => {
                if(err){
                    return res.status(500).json({ success: false, message : 'Something went wrong'}); 
                }
                if(result === true){
                    const email = req.body.email;
                    const password = req.body.password;
                    console.log(req.body);
            
                    const data = await Login.create({ email:email, password:password });
                    return res.status(201).json({ success: true, message: 'Login Successful'});
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