const bodyParser = require('body-parser');
const Expense = require('../models/expense');
const Downloads = require('../models/download');
const UserServices = require('../services/userServices');
const S3Services = require('../services/s3services');
const uuid = require('uuid');
const ITEMS_PER_PAGE = 3;

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
        const page = req.query.page || 1;
        let totalItems ;
        Expense.count({ where: {userId: req.user.id}})
        .then((total) => {
            totalItems = total;
           // console.log('totalItems is :',totalItems);
            return Expense.findAll({ where: {userId: req.user.id},
                offset: (page-1) * ITEMS_PER_PAGE,
                limit: ITEMS_PER_PAGE            
            })
        })
        .then((expenseDetails) => {
           // console.log('ITEMS_PER_PAGE * page is:',ITEMS_PER_PAGE * page);
            return res.status(200).json({
                AllExpenses : expenseDetails ,
                isPremiumUser : req.user.ispremiumuser,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: +page+1,
                hasPreviousPage:page>1,
                previousPage:+page-1,
                lastPage:Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch((err) => console.log(err));
        //const expenseDetails = await Expense.findAll({where: {userId: req.user.id}});
        // const expenseDetails = await req.user.getExpenses();
        // if(expenseDetails){
        //     return res.status(200).json( { AllExpenses : expenseDetails , isPremiumUser : req.user.ispremiumuser});
        // }
    } catch (err){
        console.log(err);
        return res.status(500).json({err: 'Something went wrong', success: false});
    }
}

exports.deleteExpenseDetails = async (req, res) => {
    try{ const uId = req.params.id;
         const user = await Expense.findByPk(uId);
         //console.log('element belongs to userId: ',user.dataValues.userId);
        // console.log('logged in user id:',req.user.id)
         if(req.user.id === user.dataValues.userId){
            const result = await Expense.destroy({where: {id: uId}});
             res.sendStatus(200);
         }
    } catch (err) {
        return res.status(500).json({err: 'Something went wrong', success: false});
    }
}

exports.downloadexpense = async (req,res) => {
    try {
      const expenses = await UserServices.getExpenses(req); // here expenses are array. 
      console.log(expenses);
      const stringifiedExpenses = JSON.stringify(expenses); // converting array to string 
      // filename should depend upon userid
      const userid = req.user.id;

      const filename = `Expense${userid}/${new Date()}.txt`;
      const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
      console.log(fileUrl);
      const id = uuid.v4();
      const urladdedtotable = await Downloads.create({id, fileUrl, userId:req.user.id });
      console.log('urladdedtotable : ',urladdedtotable);
      res.status(201).json({ fileUrl, success: true});
    } catch(err) {
        console.log(err);
        res.status(500).json({ fileUrl:'', success: false, err: err});  
    }  
}    

exports.getUrlTable = async (req,res) => {
    try{
        const response = await Downloads.findAll({where : {userId : req.user.id}});
        res.status(201).json({response,success: true})
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err}); 
    }

}