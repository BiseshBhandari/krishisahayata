const express = require('express');
const adminController = require('../controller/admin_controller/videoFeature');
const postVerifictionController = require('../controller/admin_controller/verifyPosts');
const productVerificationController = require('../controller/admin_controller/verifyProduct');
const adminDashController = require('../controller/admin_controller/adminDash');
const { authMiddleware, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware, authorizeRole('admin'));

router.get('/metrics/:admin_id', adminDashController.getMetrics);
router.get('/pending-items/:admin_id', adminDashController.getPendingItems);
router.get('/post-trends/:admin_id', adminDashController.getPostTrends);
router.get('/product-status/:admin_id', adminDashController.getProductStatus);

router.post('/upload_video/:admin_id', adminController.uploadVideo);
router.get('/videos/:admin_id', adminController.getAdminVideos);
router.delete('/deleteVideo/:tutorial_id', adminController.deleteVideo);

router.get('/verifyPost', postVerifictionController.getPendingPosts);
router.put('/approvePost/:post_id', postVerifictionController.approvePost);

router.get('/verifyProduct', productVerificationController.getPendingProducts);
router.put('/approveProduct/:productId', productVerificationController.approveProduct);
router.put('/rejectProduct/:productId', productVerificationController.rejectProduct);

module.exports = router;