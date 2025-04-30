const User = require('../model/userModel');
const transporter = require('../config/mail_config');
const authController = require('../controller/authController');

jest.mock('../model/userModel');
jest.mock('../config/mail_config');

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

    describe('forgotPassword', () => {
        it('should return 404 if user not found', async () => {
            req.body = { email: 'john@example.com' };
            User.findOne.mockResolvedValue(null);

            await authController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Sorry, user not found' });
        });

        it('should send reset code email successfully', async () => {
            req.body = { email: 'john@example.com' };
            const user = { email: 'john@example.com', name: 'John', update: jest.fn().mockResolvedValue(true) };
            User.findOne
                .mockResolvedValueOnce(user) // For checking user existence
                .mockResolvedValueOnce(null); // For checking unique reset code
            transporter.sendMail.mockResolvedValue(true);

            await authController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Email sent successfully' }));
            expect(transporter.sendMail).toHaveBeenCalled();
            expect(user.update).toHaveBeenCalledWith({
                reset_Token: expect.any(String),
                reset_token_exp: expect.any(Number)
            });
        });

        it('should handle errors', async () => {
            req.body = { email: 'john@example.com' };
            User.findOne.mockRejectedValue(new Error('Database error'));

            await authController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred in the system',
                error: 'Database error'
            });
        });
    });
});