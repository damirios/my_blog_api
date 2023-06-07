const jwt = require('jsonwebtoken');
const Token = require("../models/token");

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    
        return {
            accessToken, refreshToken
        }
    }

    async saveTokenInDB(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await Token.create({user: userId, refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        const tokenInDB = await Token.findOneAndDelete({refreshToken});
        return tokenInDB;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {

            return null;
        }
    }

    async findToken(token) {
        const tokenInDB = await Token.findOne({refreshToken: token});
        return tokenInDB;
    }
}

module.exports = new TokenService();