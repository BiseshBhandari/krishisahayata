const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");
const axios = require('axios');
const { User, Product, Cart, Order, OrderItem } = require("../../model/association");
require('dotenv').config();

exports.createOrder = async (req, res) => {
    const { userId, totalPrice } = req.body;

    try {
        const order = await Order.create({
            userId,
            paymentStatus: "Pending",
            orderStatus: "Pending",
            totalAmount: totalPrice,
        });

        const cartItems = await Cart.findAll({ where: { userId } });

        if (!cartItems.length) {
            return res.status(404).json({ error: "Cart is empty" });
        }

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

    console.log('Fetching orders for userId:', userId);

    try {
        const orders = await Order.findAll({
            where: {
                userId,
                paymentStatus: "Pending",
                orderStatus: "Pending"
            }
        });

        if (orders.length === 0) {
            console.log('No orders found for userId:', userId);
            return res.status(404).json({ error: "No orders found" });
        }

        const uid = uuidv4();
        const esewaUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
        const successUrl = `${process.env.FRONTEND_URL}/farmer/payment-success/${orders[0].id}`;
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
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: "Error fetching orders" });
    }
};

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const { userId } = req.body;

    try {
        const order = await Order.findOne({ where: { id: orderId, userId } });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.orderStatus !== "Pending" || order.paymentStatus !== "Pending") {
            return res.status(400).json({ error: "Cannot cancel order. It's already confirmed or paid." });
        }

        // Delete order items first
        await OrderItem.destroy({ where: { orderId } });

        // Delete the order
        await order.destroy();

        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling order:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.verifyEsewaPayment = async (req, res) => {
    const { transaction_uuid, total_amount, product_code, transaction_code, status, signature } = req.body;
    const { order_id } = req.params;

    const cleanedTotalAmount = total_amount.replace(/,/g, '');

    if (!transaction_uuid || !transaction_code || !cleanedTotalAmount || !status || !signature) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const order = await Order.findOne({ where: { id: order_id } });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const esewaResponse = await axios.get(`https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${cleanedTotalAmount}&transaction_uuid=${transaction_uuid}`);

        const esewaData = esewaResponse.data;
        console.log("eSewa Response:", esewaData);

        if (esewaData.status === "COMPLETE") {
            // Update order status
            await order.update({
                paymentStatus: "Paid",
                orderStatus: "Confirmed",
            });

            // Find all ordered items for this order
            const orderItems = await OrderItem.findAll({ where: { orderId: order_id } });

            // Decrease stock for each product
            for (const item of orderItems) {
                const product = await Product.findOne({ where: { product_id: item.productId } });
                if (product) {
                    let newStock = product.stockQuantity - item.quantity;
                    let newStatus = newStock <= 0 ? "out-of-stock" : "in-Stock";

                    await product.update({
                        stockQuantity: newStock,
                        stockStatus: newStatus,
                    });
                }
            }

            console.log("Payment verified, order updated, and stock adjusted");
            return res.status(200).json({ success: true, message: "Payment verified, order updated, and stock adjusted" });
        } else {
            await order.destroy();
            console.log("Payment not completed. Order deleted.");
            return res.status(400).json({ error: "Payment not completed. Order deleted." });
        }

    } catch (error) {
        console.error("Error verifying payment:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.getCustomerOrderHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            attributes: ['name', 'price', 'imageUrl'],
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (!orders.length) {
            return res.status(404).json({ error: "No orders found" });
        }

        res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ error: "Error fetching order history" });
    }
};

// Fetch orders related to products created by a user (seller view)
exports.getSellerOrderDetails = async (req, res) => {
    const { sellerId } = req.params;

    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            where: { user_ID: sellerId },
                            attributes: ['name', 'price', 'imageUrl']
                        }
                    ]
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'asc']]
        });

        // Filter out orders where no order items belong to the seller
        const filteredOrders = orders.filter(order =>
            order.OrderItems.some(orderItem => orderItem.Product)
        );

        if (!filteredOrders.length) {
            return res.status(404).json({ error: "No orders found for your products" });
        }

        res.status(200).json({ success: true, orders: filteredOrders });
    } catch (error) {
        console.error("Error fetching seller order details:", error);
        res.status(500).json({ error: "Error fetching seller order details" });
    }
};


exports.updateDeliveryStatus = async (req, res) => {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    if (!deliveryStatus) {
        return res.status(400).json({ error: "Delivery status is required" });
    }

    try {
        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        await order.update({ deliveryStatus });

        res.status(200).json({ success: true, message: "Delivery status updated successfully", order });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
