const { getAllPosts } = require('../controller/userController/postFetaure');
const { Post, User } = require('../model/association');
const sequelize = require('../config/db_config');

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

// Mock response object
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

    describe('getAllPosts', () => {
        it('should fetch all approved posts successfully', async () => {
            const req = {};
            const res = mockResponse();

            Post.findAll.mockResolvedValue([
                {
                    post_id: 1,
                    user_id: 1,
                    content: 'Test post',
                    image_url: '/uploads/postImages/test.jpg',
                    approval_status: 'approved',
                    created_at: new Date(),
                    User: { user_id: 1, name: 'John Doe', profile_image_url: '/profile.jpg' },
                    get: jest.fn().mockReturnValue({
                        commentCount: 5,
                        likeCount: 10,
                    }),
                },
                {
                    post_id: 2,
                    user_id: 2,
                    content: 'Another post',
                    image_url: null,
                    approval_status: 'approved',
                    created_at: new Date(),
                    User: { user_id: 2, name: 'Jane Doe', profile_image_url: '/profile2.jpg' },
                    get: jest.fn().mockReturnValue({
                        commentCount: 2,
                        likeCount: 3,
                    }),
                },
            ]);

            await getAllPosts(req, res);

            expect(Post.findAll).toHaveBeenCalledWith({
                where: { approval_status: 'approved' },
                attributes: {
                    include: [
                        [expect.any(Object), 'commentCount'],
                        [expect.any(Object), 'likeCount'],
                    ],
                },
                include: {
                    model: User,
                    attributes: ['user_id', 'name', 'profile_image_url'],
                },
                order: [['created_at', 'DESC']],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                posts: expect.arrayContaining([
                    expect.objectContaining({ post_id: 1, content: 'Test post' }),
                    expect.objectContaining({ post_id: 2, content: 'Another post' }),
                ]),
            });
        });

        it('should return empty array if no approved posts exist', async () => {
            const req = {};
            const res = mockResponse();

            // Mock Post.findAll to return empty array
            Post.findAll.mockResolvedValue([]);

            await getAllPosts(req, res);

            expect(Post.findAll).toHaveBeenCalledWith({
                where: { approval_status: 'approved' },
                attributes: {
                    include: [
                        [expect.any(Object), 'commentCount'],
                        [expect.any(Object), 'likeCount'],
                    ],
                },
                include: {
                    model: User,
                    attributes: ['user_id', 'name', 'profile_image_url'],
                },
                order: [['created_at', 'DESC']],
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ posts: [] });
        });

        it('should return 500 on server error', async () => {
            const req = {};
            const res = mockResponse();

            // Mock Post.findAll to throw an error
            Post.findAll.mockRejectedValue(new Error('Database error'));

            await getAllPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
                error: 'Database error',
            });
        });
    });
});