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
