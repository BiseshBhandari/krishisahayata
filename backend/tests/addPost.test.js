const { addPost } = require('../controller/userController/postFetaure'); 
const { Post, User } = require('../model/association');
const sequelize = require('../config/db_config');
const fs = require('fs');
const path = require('path');

jest.mock('../model/association', () => ({
    Post: {
        create: jest.fn(),
        findAll: jest.fn(),
    },
    User: {
        findByPk: jest.fn(),
    },
}));
jest.mock('../config/db_config', () => ({
    literal: jest.fn().mockImplementation((query) => ({ query })),
}));
jest.mock('fs');
jest.mock('path');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Post Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addPost', () => {
        it('should create a post successfully with content and no image', async () => {
            const req = {
                body: { content: 'This is a test post' },
                params: { user_id: 1 },
                files: null,
            };
            const res = mockResponse();

            User.findByPk.mockResolvedValue({ user_id: 1 });

            Post.create.mockResolvedValue({
                post_id: 1,
                user_id: 1,
                content: 'This is a test post',
                image_url: null,
                approval_status: 'pending',
                created_at: new Date(),
            });

            await addPost(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Post.create).toHaveBeenCalledWith({
                user_id: 1,
                content: 'This is a test post',
                image_url: null,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post added successfully',
                post: expect.any(Object),
            });
        });

        it('should create a post successfully with content and image', async () => {
            const req = {
                body: { content: 'Post with image' },
                params: { user_id: 1 },
                files: {
                    image: {
                        name: 'test.jpg',
                        size: 5 * 1024 * 1024, // 5MB
                        mv: jest.fn().mockResolvedValue(undefined),
                    },
                },
            };
            const res = mockResponse();

            // Mock file system
            fs.existsSync.mockReturnValue(true);
            fs.mkdirSync.mockImplementation(() => {});

            // Mock path.join to return a dynamic image_url with correct case
            const timestamp = Date.now();
            path.join.mockImplementation((...args) => {
                if (args.includes('postImages')) {
                    return `/uploads/postImages/${timestamp}_test.jpg`;
                }
                return '/path/to/uploads/postImages';
            });

            // Mock User.findByPk
            User.findByPk.mockResolvedValue({ user_id: 1 });

            // Mock Post.create
            Post.create.mockResolvedValue({
                post_id: 1,
                user_id: 1,
                content: 'Post with image',
                image_url: `/uploads/postImages/${timestamp}_test.jpg`,
                approval_status: 'pending',
                created_at: new Date(),
            });

            await addPost(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(fs.existsSync).toHaveBeenCalled();
            expect(req.files.image.mv).toHaveBeenCalled();
            expect(Post.create).toHaveBeenCalledWith({
                user_id: 1,
                content: 'Post with image',
                image_url: `/uploads/postImages/${timestamp}_test.jpg`,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post added successfully',
                post: expect.any(Object),
            });
        });

        it('should return 400 if content is missing', async () => {
            const req = {
                body: {},
                params: { user_id: 1 },
                files: null,
            };
            const res = mockResponse();

            await addPost(req, res);

            expect(User.findByPk).not.toHaveBeenCalled();
            expect(Post.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Content of the Post required',
            });
        });

        it('should return 404 if user does not exist', async () => {
            const req = {
                body: { content: 'This is a test post' },
                params: { user_id: 1 },
                files: null,
            };
            const res = mockResponse();

            // Mock User.findByPk to return null
            User.findByPk.mockResolvedValue(null);

            await addPost(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Post.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found',
            });
        });

        it('should return 400 if image size exceeds 10MB', async () => {
            const req = {
                body: { content: 'Post with large image' },
                params: { user_id: 1 },
                files: {
                    image: {
                        name: 'large.jpg',
                        size: 11 * 1024 * 1024, // 11MB
                        mv: jest.fn(),
                    },
                },
            };
            const res = mockResponse();

            // Mock User.findByPk
            User.findByPk.mockResolvedValue({ user_id: 1 });

            await addPost(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Post.create).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File size exceeds the 10MB limit',
            });
        });

        it('should return 500 on server error', async () => {
            const req = {
                body: { content: 'This is a test post' },
                params: { user_id: 1 },
                files: null,
            };
            const res = mockResponse();

            // Mock User.findByPk
            User.findByPk.mockResolvedValue({ user_id: 1 });

            // Mock Post.create to throw an error
            Post.create.mockRejectedValue(new Error('Database error'));

            await addPost(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
                error: 'Database error',
            });
        });
    });

});