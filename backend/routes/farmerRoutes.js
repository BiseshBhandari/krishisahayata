const express = require('express');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const userController = require('../controller/userController/postFetaure');
const { getallVideos } = require('../controller/userController/userSideVideo');
const { addProduct, getAllProducts, getUserProducts, deleteProduct, updateProduct } = require('../controller/userController/ProductFeature');
const cartController = require('../controller/userController/cartFeature');
const orderController = require('../controller/userController/orderFeature');
const cropGuideController = require('../controller/userController/cropGuideFeature');
const commmentController = require('../controller/userController/commentFeature');
const profileController = require('../controller/userController/profileFeature');

const router = express.Router();

router.get("/profile/:user_id", profileController.viewProfile);
router.put("/updateProfile/:user_id", profileController.updateProfile);


router.use(authMiddleware, authorizeRole('farmer'));
 
router.get('/videos', getallVideos); 
router.get('/products', getAllProducts);

// Profile
// Post feature
router.post('/addPost/:user_id', userController.addPost);
router.get('/posts/:user_id', userController.getAllPosts);
router.get('/userPost/:user_id', userController.getUserPost);
router.put('/updatePost/:post_id', userController.editPost);
router.delete('/deletePost/:post_id', userController.deletePost);
router.put("/likePost", userController.likeUnlikePost);
router.get('/getLikedposts/:user_id', userController.getLikedPosts);

// Comment feature
router.post('/addComment', commmentController.addComment);
router.get('/getComments/:postId', commmentController.getComments);
router.delete('/deleteComment/:commentId', commmentController.deleteComment);
router.post('/addReply', commmentController.replyToComment);

// Product feature
router.post('/addProduct/:user_ID', addProduct);
router.get('/userProduct/:user_id', getUserProducts);
router.delete("/deleteProduct/:product_id", deleteProduct);
router.put('/updateProduct/:product_id', updateProduct);

// Cart feature
router.post('/addCart', cartController.addCart);
router.get('/cart/:userId', cartController.getCart);
router.post('/addQuantity', cartController.addQuantity);
router.post('/decreaseQuantity', cartController.decreaseQuantity);
router.delete('/removeItem', cartController.removeItem);
router.delete('/clearCart/:userId', cartController.clearCart);

// Order feature
router.post('/createOrder', orderController.createOrder);
router.get('/getOrders/:userId', orderController.getOrders);
router.post('/verifyPayment/:order_id', orderController.verifyEsewaPayment);
router.get('/getCustomerOrderDetails/:userId', orderController.getCustomerOrderHistory);
router.get('/getSellerOrderDetails/:sellerId', orderController.getSellerOrderDetails);
router.put('/updateDeliveryStatus/:orderId', orderController.updateDeliveryStatus);

// Crop Guide
router.post('/getCropGuide', cropGuideController.getCropGuide);

module.exports = router;
