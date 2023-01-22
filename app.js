const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');

var cors = require('cors');
const app = express();

app.use(cors());

const signupRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expense');

app.use(bodyParser.json({ extended: false }));

const { userInfo } = require('os');

app.use('/user',signupRoutes);
app.use('/expense',expenseRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(result => {
  //console.log(result);
  app.listen(3000);
})
.catch(err => console.log(err));
