const { User, Post, Product, Video, Comment, Like, Order, Reply } = require('../../model/association'); // Adjust path to your models
const { Op } = require('sequelize');

exports.getMetrics = async (req, res) => {
    try {
        const [userCount, postCount, productCount, videoCount, commentCount, likeCount, orderCount, replyCount, pendingPosts, pendingProducts] = await Promise.all([
            User.count(),
            Post.count(),
            Product.count(),
            Video.count(),
            Comment.count(),
            Like.count(),
            Order.count(),
            Reply.count(),
            Post.count({ where: { approval_status: 'pending' } }),
            Product.count({ where: { approvalStatus: 'pending' } }),
        ]);

        return res.status(200).json({
            message: 'Metrics fetched successfully',
            metrics: {
                users: userCount,
                posts: postCount,
                products: productCount,
                videos: videoCount,
                comments: commentCount,
                likes: likeCount,
                orders: orderCount,
                replies: replyCount,
                pendingPosts,
                pendingProducts,
            },
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).json({ message: 'Error fetching metrics', error: error.message });
    }
};

exports.getPendingItems = async (req, res) => {
    try {
        const [pendingPosts, pendingProducts] = await Promise.all([
            Post.findAll({
                where: { approval_status: 'pending' },
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [{ model: User, attributes: ['name'] }],
            }),
            Product.findAll({
                where: { approvalStatus: 'pending' },
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [{ model: User, attributes: ['name'] }],
            }),
        ]);

        return res.status(200).json({
            message: 'Pending items fetched successfully',
            pendingItems: {
                posts: pendingPosts,
                products: pendingProducts,
            },
        });
    } catch (error) {
        console.error('Error fetching pending items:', error);
        return res.status(500).json({ message: 'Error fetching pending items', error: error.message });
    }
};

exports.getPostTrends = async (req, res) => {
    try {
        const [approved, pending, rejected] = await Promise.all([
            Post.count({ where: { approval_status: 'approved' } }),
            Post.count({ where: { approval_status: 'pending' } }),
            Post.count({ where: { approval_status: 'disapproved' } }),
        ]);

        return res.status(200).json({
            message: 'Post trends fetched successfully',
            postTrends: {
                approved,
                pending,
                rejected,
            },
        });
    } catch (error) {
        console.error('Error fetching post trends:', error);
        return res.status(500).json({ message: 'Error fetching post trends', error: error.message });
    }
};

exports.getProductStatus = async (req, res) => {
    try {
        const [approved, pending, rejected] = await Promise.all([
            Product.count({ where: { approvalStatus: 'approved' } }),
            Product.count({ where: { approvalStatus: 'pending' } }),
            Product.count({ where: { approvalStatus: 'rejected' } }),
        ]);

        return res.status(200).json({
            message: 'Product status fetched successfully',
            productStatus: {
                approved,
                pending,
                rejected,
            },
        });
    } catch (error) {
        console.error('Error fetching product status:', error);
        return res.status(500).json({ message: 'Error fetching product status', error: error.message });
    }
};

