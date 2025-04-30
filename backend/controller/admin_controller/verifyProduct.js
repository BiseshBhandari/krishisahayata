const { Product, User } = require('../../model/association');

exports.getPendingProducts = async (req, res) => {
    try {
        const pendingProducts = await Product.findAll({
            where: {
                approvalStatus: 'pending'
            },
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });

        res.status(200).json({
            success: true,
            message: 'Pending products retrieved successfully',
            products: pendingProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving pending products',
            error: error.message
        });
    }
};
exports.approveProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.approvalStatus === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Product is already approved'
            });
        }

        product.approvalStatus = 'approved';
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product approved successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving product',
            error: error.message
        });
    }
};

exports.rejectProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.approvalStatus === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Product is already rejected'
            });
        }

        product.approvalStatus = 'rejected';
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product rejected successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting product',
            error: error.message
        });
    }
};