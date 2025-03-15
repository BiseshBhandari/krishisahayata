const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");
const { User, Product, Cart, Order, OrderItem } = require("../../model/association");
require('dotenv').config();

exports.createOrder = async (req, res) => {
    const { userId, totalPrice } = req.body;

    try {
        // Create an order with "Pending" status
        const order = await Order.create({
            userId,
            paymentStatus: "Pending",
            orderStatus: "Pending",
            totalAmount: totalPrice,
        });

        // Fetch all cart items for the user
        const cartItems = await Cart.findAll({ where: { userId } });

        if (!cartItems.length) {
            return res.status(404).json({ error: "Cart is empty" });
        }

        // Create order items from cart items
        const orderItems = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findByPk(item.productId);
                if (!product) return null;

                return OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    total: item.quantity * product.price,
                });
            })
        );

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating order" });
    }
};


exports.getOrders = async (req, res) => {
    const { userId } = req.params;

    console.log('Fetching orders for userId:', userId);  // Log the userId

    try {
        // Fetch orders from the database, only the order details
        const orders = await Order.findAll({
            where: { userId },
        });

        if (orders.length === 0) {
            console.log('No orders found for userId:', userId);  // Log if no orders are found
            return res.status(404).json({ error: "No orders found" });
        }

        // If orders are found, generate payment details
        const uid = uuidv4();
        const esewaUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        const successUrl = `${process.env.FRONTEND_URL}/farmer/payment-success?order_id=${orders[0].id}`;
        const productCode = "EPAYTEST";
        const secret = "8gBm/:&EnhH.1/q";

        const message = `total_amount=${orders[0].totalAmount},transaction_uuid=${uid},product_code=${productCode}`;
        const hash = CryptoJS.HmacSHA256(message, secret);
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        const esewaPayload = {
            amount: orders[0].totalAmount,
            tax_amount: 0,
            total_amount: orders[0].totalAmount,
            transaction_uuid: uid,
            product_code: productCode,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: successUrl,
            failure_url: `${process.env.FRONTEND_URL}/farmer/payment-failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: hashInBase64,
        };

        res.status(200).json({ success: true, orders, esewaPayload, esewaUrl, uid });

    } catch (error) {
        console.error('Error fetching orders:', error);  // Log the error for debugging
        res.status(500).json({ error: "Error fetching orders" });
    }
};

