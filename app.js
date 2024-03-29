const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const path = require('path');
const fs = require('fs');

require("dotenv").config();
const sequelize = require('./util/database');

var cors = require('cors');

const app = express();

//createWriteStream : reads sequentially from the current file position.
// flag:a  open file for appending . the file is created if it does not exist
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a'}
);

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
const Downloads = require('./models/download');

app.use(express.static('public'));
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user',signupRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);

app.use((req,res) => {
  console.log('URL : ',req.url);
  console.log('Request has arrived .');
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})

app.use(errorController.get404);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(Downloads);
Downloads.belongsTo(User);

console.log(process.env.NODE_ENV); // express.js use it as default to detrermine environment mode
//  {force: true}
sequelize.sync()
.then(result => {
  app.listen(process.env.PORT || 3000);
})
.catch(err => console.log(err));