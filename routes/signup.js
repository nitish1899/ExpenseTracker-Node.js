const path = require('path');

const express = require('express');

const signupController = require('../controllers/signup');

const router = express.Router();

router.post('/signup', signupController.postSignUpDetails);
//router.get('/get-expense', signupController.getExpenseDetails);
//router.delete('/delete-expense/:id', signupController.deleteExpenseDetails);

module.exports = router;