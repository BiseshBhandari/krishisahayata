const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../model/userModel');
const authController = require('../controller/authController');

jest.mock('../model/userModel');
jest.mock('bcryptjs');
jest.mock('validator');

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

    describe('register', () => {
        it('should return 400 if email is invalid', async () => {
            req.body = { name: 'John', email: 'invalid', password: 'password123' };
            validator.isEmail.mockReturnValue(false);

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Provide a correct mail' });
        });

        it('should return 400 if email already exists', async () => {
            req.body = { name: 'John', email: 'john@example.com', password: 'password123' };
            validator.isEmail.mockReturnValue(true);
            User.findOne.mockResolvedValue({ email: 'john@example.com' });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists in the system' });
        });

        it('should create user successfully', async () => {
            req.body = { name: 'John', email: 'john@example.com', password: 'password123' };
            validator.isEmail.mockReturnValue(true);
            User.findOne.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue({ name: 'John', email: 'john@example.com', password_hash: 'hashedPassword' });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created Sucessfully' });
            expect(User.create).toHaveBeenCalledWith({
                name: 'John',
                email: 'john@example.com',
                password_hash: 'hashedPassword'
            });
        });

        it('should handle errors', async () => {
            req.body = { name: 'John', email: 'john@example.com', password: 'password123' };
            validator.isEmail.mockReturnValue(true);
            User.findOne.mockRejectedValue(new Error('Database error'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user', error: 'Database error' });
        });
    });
});