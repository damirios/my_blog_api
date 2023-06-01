const express = require('express');
const { user_create, user_list, user_detail, user_update_first_name, user_update_last_name,
    user_update_login, 
    user_update_password,
    user_update_avatar,
    user_become_admin,
    user_delete} = require('../controllers/user_controller');

const router = express.Router();

router.get('/', user_list);
router.get('/:id', user_detail);

router.post('/create', user_create);
router.post('/:id/admin', user_become_admin);

router.put('/:id/first', user_update_first_name);
router.put('/:id/last', user_update_last_name);
router.put('/:id/login', user_update_login);
router.put('/:id/password', user_update_password);
router.put('/:id/avatar', user_update_avatar);

router.delete('/:id', user_delete);


module.exports = router;