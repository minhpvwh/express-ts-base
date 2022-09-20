"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_service_1 = __importDefault(require("../../common/services/redis.service"));
const configs_1 = require("../../configs");
const http_middleware_1 = require("../../common/middleware/http.middleware");
const users_dao_1 = __importDefault(require("../../users/daos/users.dao"));
const log = (0, debug_1.default)('app:auth-controller');
const jwtSecret = configs_1.auth.JWT_SECRET;
const jwtRefreshSecret = configs_1.auth.JWT_REFRESH_SECRET;
const tokenExpirationInSeconds = configs_1.auth.JWT_EXPIRATION;
const tokenRefreshExpirationInSeconds = configs_1.auth.JWT_REFRESH_EXPIRATION;
const tokenRefreshExpirationRedisInSeconds = configs_1.auth.JWT_REFRESH_EXPIRATION_REDIS;
class AuthController {
    generateRefreshToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const refresh_token = jsonwebtoken_1.default.sign(data, jwtRefreshSecret, { expiresIn: tokenRefreshExpirationInSeconds });
            yield redis_service_1.default.set(data.sub, JSON.stringify({ token: refresh_token }), { EX: tokenRefreshExpirationRedisInSeconds });
            return refresh_token;
        });
    }
    createJWT(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const { _id: sub, email, role, provider } = req.user;
                const jwtData = {
                    sub: sub.toString(),
                    email,
                    provider,
                    role
                };
                const accessToken = jsonwebtoken_1.default.sign(jwtData, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });
                const refreshToken = yield authController.generateRefreshToken(jwtData);
                return (0, http_middleware_1.responseHasData)(res, { accessToken, refreshToken });
            }
            catch (err) {
                log('createJWT error: %O', err);
                return (0, http_middleware_1.responseError)(res, err);
            }
        });
    }
    createJWTOauth2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const { email } = req.user._json;
                let user = yield users_dao_1.default.getUserByEmail(email);
                if (!user) {
                    // @ts-ignore
                    user = yield users_dao_1.default.addUserWithoutPassword(req.user._json);
                }
                const jwtData = {
                    sub: user._id.toString(),
                    email: user.email,
                    provider: user.provider,
                    role: user.role
                };
                const accessToken = jsonwebtoken_1.default.sign(jwtData, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });
                const refreshToken = yield authController.generateRefreshToken(jwtData);
                return (0, http_middleware_1.responseHasData)(res, { accessToken, refreshToken });
            }
            catch (err) {
                log('createJWT error: %O', err);
                return (0, http_middleware_1.responseError)(res, err);
            }
        });
    }
    createJWTOauth2V2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                let { email, providerUID } = req.user;
                let user;
                if (email) {
                    user = yield users_dao_1.default.getUserByEmail(email);
                }
                else {
                    email = providerUID + '@ex.com';
                    user = yield users_dao_1.default.getUserByProviderUID(providerUID);
                }
                if (!user) {
                    // @ts-ignore
                    user = yield users_dao_1.default.addUserWithoutPassword(req.user);
                }
                const jwtData = {
                    sub: user._id.toString(),
                    email: user.email,
                    provider: user.provider,
                    role: user.role,
                    providerUID: user.providerUID
                };
                const accessToken = jsonwebtoken_1.default.sign(jwtData, jwtSecret, {
                    expiresIn: tokenExpirationInSeconds,
                });
                const refreshToken = yield authController.generateRefreshToken(jwtData);
                return (0, http_middleware_1.responseHasData)(res, { accessToken, refreshToken });
            }
            catch (err) {
                log('createJWT error: %O', err);
                return (0, http_middleware_1.responseError)(res, err);
            }
        });
    }
    getAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const { sub, email, provider, role } = req.user;
                const jwtData = {
                    sub,
                    email,
                    provider,
                    role
                };
                const access_token = jsonwebtoken_1.default.sign(jwtData, jwtSecret, { expiresIn: tokenRefreshExpirationInSeconds });
                const refresh_token = yield authController.generateRefreshToken(jwtData);
                return res.json({ code: 200, message: "success", data: { access_token, refresh_token } });
            }
            catch (err) {
                log('getAccessToken error: %O', err);
                return (0, http_middleware_1.responseError)(res, err);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // remove the refresh token
                // @ts-ignore
                yield redis_service_1.default.del(req.user.sub);
                // blacklist current access token
                // @ts-ignore
                yield redis_service_1.default.set('BL_' + req.user.sub, req.token);
                return (0, http_middleware_1.responseSimple)(res);
            }
            catch (err) {
                log('logout error: %O', err);
                return (0, http_middleware_1.responseError)(res, err);
            }
        });
    }
}
const authController = new AuthController();
exports.default = authController;
