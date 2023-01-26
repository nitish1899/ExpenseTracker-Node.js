const express = require('express');

const forgotPasswordController = require('../controllers/premiumFeatures');


const router = express.Router();

router.get('/forgotpassword', forgotPasswordController.getLeaderBoard);

module.exports = router;