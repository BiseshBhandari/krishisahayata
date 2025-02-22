const express = require('express');
const userController = require('../controller/userController/postFetaure')
const { getallVideos } = require('../controller/userController/userSideVideo')
const router = express.Router();

router.get('/videos', getallVideos);


router.post('/addPost/:user_id', userController.addPost);
router.get('/posts', userController.getAllPosts);
router.get('/userPost/:user_id', userController.getUserPost);
router.delete('/deletePost/:post_id', userController.deletePost);

module.exports = router;