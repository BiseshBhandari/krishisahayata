const { User, Product, Cart } = require('../../model/association');

const calculateTotalCartValue = async (userId) => {
    const cartItems = await Cart.findAll({ where: { userId } });

    if (!cartItems) {
        return cartItems = 0;
    }

    return cartItems.reduce((sum, item) => sum + item.total, 0);
};

exports.addCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const qty = Number(quantity);

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let cartItem = await Cart.findOne({ where: { userId, productId } });

        if (cartItem) {
            cartItem.quantity += qty;
        } else {
            cartItem = await Cart.create({
                userId,
                productId,
                quantity: qty,
                price: product.price,
            });
        }

        cartItem.total = cartItem.quantity * product.price;
        await cartItem.save();

        const totalCartValue = await calculateTotalCartValue(userId);

        res.status(201).json({ success: true, cart: cartItem, totalPrice: totalCartValue });
    } catch (error) {
        res.status(500).json({ error: "Error adding to cart" });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: {
                model: Product,
                attributes: ["product_id", "name", "imageUrl"]
            }
        });

        const totalCartValue = await calculateTotalCartValue(userId);

        // const totalCartValue = cartItems.reduce((sum, item) => sum + item.total, 0);

        res.json({ success: true, cart: cartItems, totalPrice: totalCartValue });
    } catch (error) {
        res.status(500).json({ error: "Error fetching cart" });
    }
};

exports.addQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cartItem = await Cart.findOne({ where: { userId, productId } });
        if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

        cartItem.quantity += 1;
        cartItem.total = cartItem.quantity * cartItem.price;
        await cartItem.save();

        const totalCartValue = await calculateTotalCartValue(userId);


        res.json({ success: true, cart: cartItem, totalPrice: totalCartValue });
    } catch (error) {
        res.status(500).json({ error: "Error increasing cart quantity" });
    }
};

exports.decreaseQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cartItem = await Cart.findOne({ where: { userId, productId } });
        if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

        if (cartItem.quantity < 1) {
            await cartItem.destroy();
            return res.json({ success: true, message: "Item removed from cart" });
        }

        cartItem.quantity -= 1;
        cartItem.total = cartItem.quantity * cartItem.price;
        await cartItem.save();

        const totalCartValue = await calculateTotalCartValue(userId);


        res.json({ success: true, cart: cartItem, totalPrice: totalCartValue });
    } catch (error) {
        res.status(500).json({ error: "Error decreasing cart quantity" });
    }
};


exports.removeItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        await Cart.destroy({ where: { userId, productId } });

        const totalCartValue = await calculateTotalCartValue(userId);

        res.json({ success: true, totalPrice: totalCartValue, message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting cart item" });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        await Cart.destroy({ where: { userId } });

        const totalCartValue = await calculateTotalCartValue(userId);


        res.json({ success: true, totalPrice: totalCartValue, message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error clearing cart" });
    }
};


