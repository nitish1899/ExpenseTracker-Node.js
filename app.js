const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const User = require('./models/signup');
//const Expense = require('./models/expenses');

var cors = require('cors');
const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

const signupRoutes = require('./routes/signup');
//const userRoutes = require('./routes/user');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const { userInfo } = require('os');

app.use('/user',signupRoutes);
//app.use('/expense',expenseRoutes);
app.use(errorController.get404);

sequelize.sync()
.then(result => {
  //console.log(result);
  app.listen(3000);
})
.catch(err => console.log(err));
