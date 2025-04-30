const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../model/userModel');
const transporter = require('../config/mail_config');
require('dotenv').config();

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Provide a correct email' });
        }

        const checkExistence = await User.findOne({ where: { email } });

        if (checkExistence) {
            return res.status(400).json({ message: 'Email already exists in the system' });
        }

        const hashsalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, hashsalt);

        let verificationCode;
        let isCodeUnique = false;

        while (!isCodeUnique) {
            verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            const existingCode = await User.findOne({ where: { reset_Token: verificationCode } });
            if (!existingCode) {
                isCodeUnique = true;
            }
        }

        const newUser = await User.create({
            name,
            email,
            password_hash: hashPassword,
            is_verified: false,
            reset_Token: verificationCode,
            reset_token_exp: Date.now() + 15 * 60 * 1000 // 15 minutes
        });

        await transporter.sendMail({
            from: process.env.MY_MAIL,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Email Verification</h2>
                    <p>Hi ${name || 'there'},</p>
                    <p>Thank you for registering! Please use the code below to verify your email:</p>
                    <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007BFF;">${verificationCode}</div>
                    <p>This code is valid for <strong>15 minutes</strong>.</p>
                    <p>If you did not register, please ignore this email.</p>
                    <br />
                    <p>Thanks,<br>Your App Team</p>
                </div>
            `
        });

        return res.status(201).json({ message: 'User registered successfully. Please verify your email.', email });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, verification_code } = req.body;

    try {
        const user = await User.findOne({ where: { email, reset_Token: verification_code } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or incorrect verification code' });
        }

        if (!user.reset_token_exp || user.reset_token_exp < Date.now()) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        await user.update({
            is_verified: true,
            reset_Token: null,
            reset_token_exp: null
        });

        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            {
                userName: user.name,
                role: user.role,
                Id: user.user_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        const userData = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            location: user.location,
            mobile_number: user.mobile_number,
            profile_image_url: user.profile_image_url,
        };

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({
            message: 'An error occurred during login',
            error: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const checkUser = await User.findOne({ where: { email } });

        if (!checkUser) {
            return res.status(404).json({ message: 'Sorry, user not found' });
        }

        let resetCode;
        let isCodeUnique = false;

        while (!isCodeUnique) {
            resetCode = Math.floor(1000 + Math.random() * 9000).toString();
            const existingCode = await User.findOne({ where: { reset_Token: resetCode } });
            if (!existingCode) {
                isCodeUnique = true;
            }
        }

        const expiryTime = Date.now() + 8 * 60 * 1000; // 8 minutes

        await checkUser.update({
            reset_Token: resetCode,
            reset_token_exp: expiryTime
        });

        await transporter.sendMail({
            from: process.env.MY_MAIL,
            to: email,
            subject: 'Your Password Reset Code',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${checkUser.name || 'there'},</p>
                    <p>We received a request to reset your password. Use the code below to proceed:</p>
                    <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007BFF;">${resetCode}</div>
                    <p>This code is valid for <strong>8 minutes</strong>.</p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                    <br />
                    <p>Thanks,<br>Your App Team</p>
                </div>
            `
        });

        return res.status(200).json({ message: 'Email sent successfully', code: resetCode });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred in the system", error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { reset_code, new_password } = req.body;

    try {
        const user = await User.findOne({ where: { reset_Token: reset_code } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        if (!user.reset_token_exp || user.reset_token_exp < Date.now()) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        const isSamePassword = await bcrypt.compare(new_password, user.password_hash);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password must be different from the old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await user.update({
            password_hash: hashedPassword,
            reset_Token: null,
            reset_token_exp: null
        });

        return res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while resetting your password',
            error: error.message
        });
    }
};