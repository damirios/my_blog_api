const User = require('../models/user');
const tokenService = require('../services/token_service');
const userService = require('../services/user_service');

const bcrypt = require('bcrypt');

const {body, validationResult} = require('express-validator');
const getFormattedDate = require('../utilities/getFormattedDate');
const ApiError = require('../exceptions/api_error');

exports.user_list = async (req, res) => {
    const users = await User.find({});
    if (users.length === 0) {
        next(ApiError.BadRequest("Пользователи не найдены"));
    }

    res.json(users);
};

exports.user_detail = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return next(ApiError.BadRequest("Пользователь с таким id не найден"));
        }
    
        res.json(user);
    } catch(err) {
        next(err);
    }
    
};

// создание нового пользователя - регистрация
exports.user_create = [
    body("firstName", "Введите имя")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("lastName", "Введите фамилию")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("login", "Минимальная длина логина - 1 символ, максимальная - 16 символов")
        .trim()
        .isLength({min: 1, max: 16})
        .escape(),
    body("password", "Введите пароль")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            next( ApiError.BadRequest("Ошибка при валидации", errors.array()) );
        }

        const candidate = await User.findOne({login: req.body.login});
        if (candidate) {
            next(ApiError.BadRequest("Пользователь с таким логином уже зарегистрирован"));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 3);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            login: req.body.login,
            password: hashedPassword,
            avatar: req.body.avatar || '',
            regDate: getFormattedDate(new Date())
        });

        
        await user.save();
        const tokens = tokenService.generateTokens({login: user.login, id: user._id});
        await tokenService.saveTokenInDB(user._id, tokens.refreshToken);

        // сохраняем рефреш в куки
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true 
        });

        res.json({...tokens, user: {login: user.login, id: user._id}});
    }
];

// авторизация - логин
exports.user_login = async (req, res, next) => {
    try {
        const {login, password} = req.body;
        const userData = await userService.login(login, password);
        res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json(userData);
    } catch(err) {
        next(err);
    }

}

// выход из системы - логаут
exports.user_logout = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie("refreshToken");
    
        return res.status(200).json(token);
    } catch(err) {
        next(err);
    }
}

// обновление refresh токена
exports.user_refresh_token = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const userData = await userService.refreshToken(refreshToken);
        res.cookie("refreshToken", userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json(userData);
    } catch (err) {
        next(err);
    }
}

// обновления данных о пользователе
exports.user_update_first_name = [
    body("firstName", "Введите имя")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            next( ApiError.BadRequest("Ошибка при валидации", errors.array()) );
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            next(ApiError.BadRequest("Пользователь с таким id не найден"));
        }

        user.firstName = req.body.firstName;

        await user.save();
        res.redirect(user.url);
    }
];
exports.user_update_last_name = [
    body("lastName", "Введите фамилию")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            next( ApiError.BadRequest("Ошибка при валидации", errors.array()) );
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            next(ApiError.BadRequest("Пользователь с таким id не найден"));
        }

        user.lastName = req.body.lastName;

        await user.save();
        res.redirect(user.url);
    }
];
exports.user_update_login = [
    body("login", "Минимальная длина логина - 1 символ, максимальная - 16 символов")
        .trim()
        .isLength({min: 1, max: 16})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            next( ApiError.BadRequest("Ошибка при валидации", errors.array()) );
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            next(ApiError.BadRequest("Пользователь с таким id не найден"));
        }

        user.login = req.body.login;

        await user.save();
        res.redirect(user.url);
    }
];
exports.user_update_password = [
    body("password", "Введите пароль")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            next( ApiError.BadRequest("Ошибка при валидации", errors.array()) );
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            next(ApiError.BadRequest("Пользователь с таким id не найден"));
        }

        user.password = req.body.password;

        await user.save();
        res.redirect(user.url);
    }
];
exports.user_update_avatar = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        next(ApiError.BadRequest("Пользователь с таким id не найден"));
    }

    user.avatar = req.body.avatar;

    await user.save();
    res.redirect(user.url);
};

// изменение статуса пользователя на админа
exports.user_become_admin = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        next(ApiError.BadRequest("Пользователь с таким id не найден"));
    }

    if (user.isAdmin) {
        next(ApiError.BadRequest("Пользователь с таким id уже является админом"));
    }

    user.isAdmin = true;
    await user.save();
    res.redirect(user.url);
};

exports.user_delete = async (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            return next(err);
        }

        res.redirect('/');
    });
    
};