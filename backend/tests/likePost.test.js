const { likeUnlikePost } = require('../controller/userController/postFetaure');
const { Post, Like } = require('../model/association');

jest.mock('../model/association', () => ({
    Post: {
        findByPk: jest.fn(),
    },
    Like: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('likeUnlikePost Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                user_id: 1,
                post_id: 1,
            },
        };
        res = mockResponse();
        jest.clearAllMocks();
    });

    test('should return 404 if post is not found', async () => {
        Post.findByPk.mockResolvedValue(null);

        await likeUnlikePost(req, res);

        expect(Post.findByPk).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    test('should like a post if no existing like is found', async () => {
        Post.findByPk.mockResolvedValue({ id: 1 }); 
        Like.findOne.mockResolvedValue(null);e
        Like.create.mockResolvedValue({ post_id: 1, user_id: 1 });

        await likeUnlikePost(req, res);

        expect(Post.findByPk).toHaveBeenCalledWith(1);
        expect(Like.findOne).toHaveBeenCalledWith({ where: { post_id: 1, user_id: 1 } });
        expect(Like.create).toHaveBeenCalledWith({ post_id: 1, user_id: 1 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            post_id: 1,
            liked: true,
            message: 'Post liked successfully',
        });
    });

    test('should unlike a post if like exists', async () => {
        const mockDestroy = jest.fn().mockResolvedValue(); // Mock instance-level destroy
        Post.findByPk.mockResolvedValue({ id: 1 }); // Mock post exists
        Like.findOne.mockResolvedValue({ post_id: 1, user_id: 1, destroy: mockDestroy }); // Mock existing like with destroy method

        await likeUnlikePost(req, res);

        expect(Post.findByPk).toHaveBeenCalledWith(1);
        expect(Like.findOne).toHaveBeenCalledWith({ where: { post_id: 1, user_id: 1 } });
        expect(mockDestroy).toHaveBeenCalled(); // Check instance-level destroy
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            post_id: 1,
            liked: false,
            message: 'Post unliked successfully',
        });
    });

    test('should return 500 on internal server error', async () => {
        Post.findByPk.mockRejectedValue(new Error('Database error')); // Mock error

        await likeUnlikePost(req, res);

        expect(Post.findByPk).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Internal server error',
            error: 'Database error',
        });
    });
});