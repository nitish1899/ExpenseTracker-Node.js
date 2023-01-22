const bodyParser = require('body-parser');
const Expense = require('../models/expense');

function isstringinvalid(string){
  if(string == undefined || string.length === 0){
      return true;
  } else {
      return false;
  }      
}

exports.postExpenseDetails = async (req, res) => {
  try{
     const {amount, description, category} = req.body;
     if(isstringinvalid(`${amount}`) || isstringinvalid(description) || isstringinvalid(category)){
        return res.status(400).json({message: 'Invalid details', success: false});
     } else { 
         const data = await Expense.create({amount: amount, description: description, category: category, userId: req.user.id});
       // const data = req.user.createExpenses({amount: amount, description: description, category: category, userId: req.user.id});
        return res.status(201).json({addedExpense: data});
     }
  } catch (err) {
    return res.status(500).json({message: 'Something went wrong', success: false});
  }
}

exports.getExpenseDetails = async (req, res) => {
    try{
        //const expenseDetails = await Expense.findAll({where: {userId: req.user.id}});
        const expenseDetails = await req.user.getExpenses();
        if(expenseDetails){
            return res.status(200).json( { AllExpenses : expenseDetails });
        }
    } catch (err){
        console.log(err);
        return res.status(500).json({err: 'Something went wrong', success: false});
    }
}

exports.deleteExpenseDetails = async (req, res) => {
    try{ const uId = req.params.id;
         const user = await Expense.findByPk(uId);
         console.log('element belongs to userId: ',user.dataValues.userId);
         console.log('logged in user id:',req.user.id)
         if(req.user.id === user.dataValues.userId){
            const result = await Expense.destroy({where: {id: uId}});
             res.sendStatus(200);
         }
    } catch (err) {
        return res.status(500).json({err: 'Something went wrong', success: false});
    }}