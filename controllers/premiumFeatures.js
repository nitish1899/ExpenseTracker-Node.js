const sequelize = require('../util/database');
const Expense = require('../models/expense');
const User = require('../models/user');

const getLeaderBoard = async (req,res) => {
    try{
        const users = await User.findAll({
            attributes : ['id', 'name']
        });
        //console.log(users);
        // const userAggregatedExpense = await Expense.findAll({
        //     attributes : ['userId', [sequelize.fn('sum',sequelize.col('amount')),'total_cost']],
        //     group: ['userId']
        // });

        const expenses = await Expense.findAll({
            attributes : ['userId', 'amount'],
        });
        //console.log(expenses);
       const userAggregatedExpense = {};
        expenses.forEach(expense => {
            if(userAggregatedExpense[expense.userId]){
                userAggregatedExpense[expense.userId] =  userAggregatedExpense[expense.userId] + expense.amount;
            } else {
                userAggregatedExpense[expense.userId] = expense.amount; 
            }
        });
       
        const userLeaderBoard = [];
        users.forEach(user => {
            userLeaderBoard.push( {name: user.name, amount : userAggregatedExpense[user.id] || 0});
        });
        userLeaderBoard.sort((a , b) => b.amount - a.amount);
        //console.log(userLeaderBoard);

        console.log(userAggregatedExpense);
        res.status(200).json(userLeaderBoard);
    } catch(err) {
       console.log(err);
       res.status(500).json(err);
    }
}

module.exports = {getLeaderBoard};