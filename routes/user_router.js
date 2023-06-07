const express = require('express');

const { user_create, user_list, user_detail, user_update_first_name, user_update_last_name,
    user_update_login, 
    user_update_password,
    user_update_avatar,
    user_become_admin,
    user_delete,
    user_login,
    user_logout,
    user_refresh_token} = require('../controllers/user_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, user_list);
router.get('/refresh', user_refresh_token);
router.get('/:id', user_detail);

router.post('/create', user_create); // создание пользователя (регистрация)
router.post('/login', user_login); // вход в систему (авторизация)
router.post('/logout', user_logout); // выход из системы (логаут)
router.post('/:id/admin', user_become_admin);

router.put('/:id/first', user_update_first_name);
router.put('/:id/last', user_update_last_name);
router.put('/:id/login', user_update_login);
router.put('/:id/password', user_update_password);
router.put('/:id/avatar', user_update_avatar);

router.delete('/:id', user_delete);


module.exports = router;