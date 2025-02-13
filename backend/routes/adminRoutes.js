const express = require('express');
const adminController = require('../controller/admin_controller/videoFeature');
const { getPendingPosts, approvePost } = require('../controller/admin_controller/verifyPosts');

const router = express.Router();

// video routes
router.post('/upload_video/:admin_id', adminController.uploadVideo);
router.get('/videos/:admin_id', adminController.getAdminVideos);
router.get('/video/:tutorial_id', adminController.getallVideos);
router.delete('/deleteVideo/:tutorial_id', adminController.deleteVideo);

// post verification routes
router.get('/verifyPost', getPendingPosts);
router.put('/approvePost/:post_id', approvePost);

module.exports = router;