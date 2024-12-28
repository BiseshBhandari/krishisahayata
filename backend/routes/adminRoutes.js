const express = require('express');
const adminController = require('../controller/admin_controller/videoFeature');

const router = express.Router();

router.post('/upload_video', adminController.uploadVideo);

module.exports = router;