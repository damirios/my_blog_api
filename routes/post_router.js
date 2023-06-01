const express = require('express');
const { post_list, post_create, post_single, post_udpate, post_moderate, post_delete } = require('../controllers/post_controller');

const router = express.Router();

router.get('/', post_list);
router.get('/:id', post_single);

router.post('/', post_create);
router.post('/:id/moderate', post_moderate);

router.put('/:id', post_udpate);

router.delete('/:id', post_delete);

// router.post('/create', user_create);
// router.post('/:id/admin', user_become_admin);

// router.put('/:id/first', user_update_first_name);
// router.put('/:id/last', user_update_last_name);
// router.put('/:id/login', user_update_login);
// router.put('/:id/password', user_update_password);
// router.put('/:id/avatar', user_update_avatar);

// router.delete('/:id', user_delete);


module.exports = router;