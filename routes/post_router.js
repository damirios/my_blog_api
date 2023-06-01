const express = require('express');
const { comment_list, comment_create, comment_update, comment_moderate, comment_delete } = require('../controllers/comment_controller');
const { post_list, post_create, post_single, post_update, post_moderate, post_delete } = require('../controllers/post_controller');

const router = express.Router();

// POST
router.get('/', post_list);
router.get('/:id', post_single);
router.get('/:id/moderate', post_moderate);

router.post('/', post_create);

router.put('/:id', post_update);

router.delete('/:id', post_delete);

// COMMENT
router.get('/:postId/comment', comment_list);
router.get('/:postId/comment/:id/moderate', comment_moderate);
// router.get('/:id', post_single);

router.post('/:postId/comment', comment_create);

router.put('/:postId/comment/:id', comment_update);

router.delete('/:postId/comment/id', comment_delete);

module.exports = router;