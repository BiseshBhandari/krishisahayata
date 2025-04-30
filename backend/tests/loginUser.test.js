const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const authController = require('../controller/authController');

jest.mock('../model/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return 404 if user not found', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };
            User.findOne.mockResolvedValue(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found with this email' });
        });

        it('should return 401 if password is incorrect', async () => {
            req.body = { email: 'john@example.com', password: 'wrong' };
            User.findOne.mockResolvedValue({ email: 'john@example.com', password_hash: 'hashedPassword' });
            bcrypt.compare.mockResolvedValue(false);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect password' });
        });

        it('should login successfully and return token', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };
            const user = {
                user_id: 1,
                name: 'John',
                email: 'john@example.com',
                password_hash: 'hashedPassword',
                role: 'farmer',
                location: 'Farm',
                mobile_number: '1234567890',
                profile_image_url: 'image.jpg'
            };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'token',
                user: {
                    user_id: 1,
                    name: 'John',
                    email: 'john@example.com',
                    role: 'farmer',
                    location: 'Farm',
                    mobile_number: '1234567890',
                    profile_image_url: 'image.jpg'
                }
            });
            expect(jwt.sign).toHaveBeenCalledWith(
                { userName: 'John', role: 'farmer', Id: 1 },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );
        });

        it('should handle errors', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };
            User.findOne.mockRejectedValue(new Error('Database error'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred during login',
                error: 'Database error'
            });
        });
    });

});