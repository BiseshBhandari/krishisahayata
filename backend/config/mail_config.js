const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD
    },
});

transporter.verify((error, sccess) => {
    if (error) {
        console.error('Error while configuring nodemailer', error);
    }
    else {
        console.log('Configuration sucessfull of Nodemailer');
    }

});

module.exports = transporter;


// if (process.env.NODE_ENV !== 'test') {
//     transporter.verify((error, success) => {
//         if (error) {
//             console.error('Error while configuring nodemailer', error);
//         } else {
//             console.log('Configuration successful of Nodemailer');
//         }
//     });
// }