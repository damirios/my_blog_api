const ApiError = require('../exceptions/api_error');
const User = require('../models/user');

const bcrypt = require('bcrypt');
const tokenService = require('./token_service');

class UserService {
    async login(login, password) {
        const user = await User.findOne({login});
        if (!user) {
            throw ApiError.BadRequest("Пользователь с таким логином не зарегистрирован");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw ApiError.BadRequest("Неверный пароль!");
        }

        const tokens = await tokenService.generateTokens({login: user.login, id: user._id});
        await tokenService.saveTokenInDB(user._id, tokens.refreshToken);
        return {...tokens, user};
    }

    async logout(refreshToken) {
        const tokenInDB = await tokenService.removeToken(refreshToken);
        return tokenInDB;
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenInDB = await tokenService.findToken(refreshToken);
        
        if (!userData || !tokenInDB) {
            throw ApiError.UnauthorizedError();
        }
        
        const user = await User.findById(userData.id);

        const tokens = await tokenService.generateTokens({login: user.login, id: user._id});
        await tokenService.saveTokenInDB(user._id, tokens.refreshToken);
        return {...tokens, user};
    }
}

module.exports = new UserService();