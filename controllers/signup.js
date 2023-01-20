const bodyParser = require('body-parser');
const Expense = require('../models/signup');

// exports.getExpenseDetails = async (req, res, next) => {
//   const exp = await Expense.findAll();
//   res.status(201).json({allExpense: exp});
// };

exports.postSignUpDetails = async (req, res, next) => {
  try{
      if(!req.body.email){
        throw new Error('Email is mandatory');
      }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phNo = req.body.phNo;
  console.log(req.body);

  const data = await Expense.create({name:name, email:email, password:password,phNo:phNo });
  res.status(201).json({newExpenseDetail: data});

  } catch(err){
    console.log(err);
    res.status(500).json({error:err});
  }
};

// exports.deleteExpenseDetails = async (req, res, next) => {
//   const uId = req.params.id;
//   await Expense.destroy({where: {id: uId}});
//   res.sendStatus(200);
// };