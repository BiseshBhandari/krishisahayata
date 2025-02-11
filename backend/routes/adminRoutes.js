const express = require('express');
const adminController = require('../controller/admin_controller/videoFeature');

const router = express.Router();

router.post('/upload_video/:admin_id', adminController.uploadVideo);
router.get('/videos/:admin_id', adminController.getAllVideos);
router.delete('/deleteVideo/:tutorial_id', adminController.deleteVideo);

module.exports = router;