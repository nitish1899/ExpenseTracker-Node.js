const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');
// const sgMail = require('@sendgrid/mail')

var cors = require('cors');
const app = express();

require("dotenv").config();

app.use(cors());

const signupRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeatures');
const passwordRoutes = require('./routes/forgotPassword');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const ForgotPassword = require('./models/forgotPassword');

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const { userInfo } = require('os');

app.use('/user',signupRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);

app.use(errorController.get404);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

//  {force: true}
sequelize.sync()
.then(result => {
  //console.log(result);
  app.listen(3000);
})
.catch(err => console.log(err));
