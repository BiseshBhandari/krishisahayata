const { Product, User } = require('../../model/association');
const path = require('path');
const fs = require('fs');

exports.addProduct = async (req, res) => {
    const { name, price, description, discountPrice, category, stockQuantity } = req.body;
    const { user_ID } = req.params;

    if (!req.files || !req.files.image) {
        return res.status(400).send({ message: 'No image file uploaded.' });
    }

    const imageFile = req.files.image;

    const productFolder = path.join(__dirname, '../../uploads/productsPhotos/');
    if (!fs.existsSync(productFolder)) {
        fs.mkdirSync(productFolder, { recursive: true });
    }

    const imageName = Date.now() + path.extname(imageFile.name);
    const imagePath = path.join(productFolder, imageName);

    imageFile.mv(imagePath, async (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error uploading image.' });
        }

        try {
            const newProduct = await Product.create({
                name,
                price,
                description,
                discountPrice,
                imageUrl: `/uploads/productsPhotos/${imageName}`,
                category,
                stockQuantity,
                user_ID,
                stockStatus: "in-Stock",
                approvalStatus: "pending",
            });

            res.status(201).json({
                message: 'Product added successfully!',
                product: newProduct,
            });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({ message: 'Error saving product to database.', error: error.message });
        }
    });
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                approvalStatus: 'approved',
                stockStatus: 'in-Stock'
            }
        });
        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            products: products
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving products.',
            error: error.message
        });
    }
};


exports.getUserProducts = async (req, res) => {
    const { user_id } = req.params;
    try {
        const userProducts = await Product.findAll({ where: { user_ID: user_id } });
        res.status(200).json({ success: true, message: 'User product retrived', products: userProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user products.', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { product_id } = req.params;
    try {
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const imagePath = path.join(__dirname, '../../', product.imageUrl);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        await product.destroy();
        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product.', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { product_id } = req.params;
    const { name, price, description, discountPrice, category, stockQuantity, stockStatus } = req.body;

    try {
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let imageUrl = product.imageUrl;
        if (req.files && req.files.image) {

            const oldImagePath = path.join(__dirname, '../../', product.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            const imageFile = req.files.image;
            const productFolder = path.join(__dirname, '../../uploads/productsPhotos/');
            if (!fs.existsSync(productFolder)) {
                fs.mkdirSync(productFolder, { recursive: true });
            }

            const imageName = Date.now() + path.extname(imageFile.name);
            const newImagePath = path.join(productFolder, imageName);

            imageFile.mv(newImagePath);
            imageUrl = `/uploads/productsPhotos/${imageName}`;
        }

        await product.update({ name, price, description, discountPrice, category, stockQuantity, stockStatus, imageUrl });

        res.status(200).json({ success: true, message: "Product updated successfully.", product: product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product.', error: error.message });
    }
};
