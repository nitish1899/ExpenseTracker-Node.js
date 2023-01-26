const sequelize = require('../util/database');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY='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';

const postForgotPassword = async (req,res) => {
    try{
        const emailId = req.body.email;
        sgMail.setApiKey(SENDGRID_API_KEY);

        const message = {
            to: emailId,
            from: 'nkword1899@gmail.com',
            subject: 'Hello from sendgrid',
            text: 'Hello from sendgrid',
            html: '<h1>Hello from sendgrid</h1>',
        }
        sgMail.send(message)
        .then(response => {
            console.log('Email sent ...');
            console.log(response[0].statusCode);
            console.log(response[0].headers);   
        })
        .catch(err => console.log(err.message));
     }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}