const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../model/userModel');
const transporter = require('../config/mail_config');
require('dotenv').config();

// api to register the user in the system
exports.register = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Provide a correct mail' });
        }

        const checkExistence = await User.findOne({ where: { email } });

        if (checkExistence) {
            return res.status(400).json({ message: 'Email already exists in the system' });
        }

        const hashsalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, hashsalt);

        const newUser = await User.create({
            name,
            email,
            password_hash: hashPassword
        })

        return res.status(201).json({ message: 'User created Sucessfully', newUser })
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }

};

//api to login user into the system
exports.login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const checkEmail = await User.findOne({ where: { email } });

        if (!checkEmail) {
            return res.status(404).json({ message: 'User not avaialbe' });
        }

        const checkPassword = await bcrypt.compare(password, checkEmail.password_hash)

        if (!checkPassword) {
            return res.status(401).json({ message: 'Provide Correct Password' })
        }

        const token = jwt.sign(
            { userName: checkEmail.name, role: checkEmail.role }, 'secretKey', { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login Sucessfull', token })

    } catch (error) {
        return res.status(500).json({ message: 'Error while logging in', error: error.message })
    }

};

//api to send mail for forgot  password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const checkUser = await User.findOne({ where: { email } });

        if (!checkUser) {
            return res.status(500).json({ message: 'Sorry User not found' });
        }

        const verification_token = jwt.sign({ userId: checkUser.user_id, }, process.env.JWT_SECRET, { expiresIn: '8m' });

        const updated_user = await checkUser.update({
            reset_Token: verification_token,
            reset_token_exp: Date.now() + 8 * 60 * 1000
        })

        await transporter.sendMail({
            from: process.env.MY_MAIL,
            to: email,
            subject: 'Password reset mail',
            text: `CLick to reset Password ${process.env.RESET_LINK}/${verification_token}`
        });

        return res.status(200).json({ message: 'Reset Mail Sent Successfully' });


    } catch (error) {
        return res.status(500).json({ message: "Error occured in the system", error: error.message });
    }

};

//api for the forgot password feature
