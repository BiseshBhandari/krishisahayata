const express = require('express');
const userController = require('../controller/userController/postFetaure')
const { getallVideos } = require('../controller/userController/userSideVideo')
const { addProduct, getAllProducts, getUserProducts, deleteProduct, updateProduct } = require('../controller/userController/ProductFeature')
const router = express.Router();

router.get('/videos', getallVideos);


router.post('/addPost/:user_id', userController.addPost);
router.get('/posts', userController.getAllPosts);
router.get('/userPost/:user_id', userController.getUserPost);
router.delete('/deletePost/:post_id', userController.deletePost);

router.post('/addProduct/:user_ID', addProduct);
router.get('/products', getAllProducts);
router.get('/userProduct/:user_id', getUserProducts);
router.delete("/deleteProduct/:product_id", deleteProduct);
router.put('/updateProduct/:product_id', updateProduct);


module.exports = router;