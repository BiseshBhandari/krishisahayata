const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// api to register the user in the system
exports.register = async (req, res) => {

    const { name, email, password } = req.body;

    try {

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

        res.status(201).json({ message: 'User created Sucessfully', newUser })
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }

};

//api to login user into the system
exports.login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const checkEmail = await User.findOne({ where: { email } });

        if (!checkEmail) {
            res.status(404).json({ message: 'User not avaialbe' });
        }

        const checkPassword = await bcrypt.compare(password, checkEmail.password_hash)

        if (!checkPassword) {
            res.status(401).json({ message: 'Provide Correct Password' })
        }

        const token = jwt.sign(
            { userName: checkEmail.name, role: checkEmail.role }, 'secretKey', { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login Sucessfull', token })

    } catch (error) {
        res.status(500).json({ message: 'Error while logging in', error: error.message })
    }

};

exports.forgotPassword = async (req, res) =>{
    
};

//api for the forgot password feature
