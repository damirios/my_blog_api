const User = require('../models/user');

const {body, validationResult} = require('express-validator');
const getFormattedDate = require('../utilities/getFormattedDate');

exports.user_list = [async (req, res) => {
    const users = await User.find({});
    if (users.length === 0) {
        throw new Error("Пользователи не найдены");
    }

    res.json(users);
}];

exports.user_detail = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
        throw new Error("Пользователь с таким id не найден");
    }

    res.json(user);
};

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
            throw new Error(errors.array())
        }

        const candidate = await User.findOne({login: req.body.login});
        if (candidate) {
            throw new Error("Пользователь с таким логином уже зарегистрирован");
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            login: req.body.login,
            password: req.body.password,
            avatar: req.body.avatar || '',
            regDate: getFormattedDate(new Date())
        });

        await user.save();
        res.redirect(user.url);
    }
];

exports.user_update_first_name = [
    body("firstName", "Введите имя")
        .trim()
        .isLength({min: 1})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(body);

        if (!errors.isEmpty()) {
            throw new Error(errors.array())
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error("Пользователь с таким id не найден");
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
            throw new Error(errors.array())
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error("Пользователь с таким id не найден");
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
            throw new Error(errors.array())
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error("Пользователь с таким id не найден");
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
            throw new Error(errors.array())
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error("Пользователь с таким id не найден");
        }

        user.password = req.body.password;

        await user.save();
        res.redirect(user.url);
    }
];
exports.user_update_avatar = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new Error("Пользователь с таким id не найден");
    }

    user.avatar = req.body.avatar;

    await user.save();
    res.redirect(user.url);
};

exports.user_become_admin = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new Error("Пользователь с таким id не найден");
    }

    if (user.isAdmin) {
        throw new Error("Пользователь с таким id уже админ");
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