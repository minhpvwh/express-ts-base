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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const users_service_1 = __importDefault(require("../../users/services/users.service"));
const configs_1 = require("../../configs");
const redis_service_1 = __importDefault(require("../../common/services/redis.service"));
const http_middleware_1 = require("../../common/middleware/http.middleware");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jwtSecret = configs_1.auth.JWT_SECRET;
class JwtMiddleware {
    verifyRefreshBodyField(req, res, next) {
        if (req.body && req.body.refreshToken) {
            return next();
        }
        else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }
    validRefreshNeeded(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByEmailWithPassword(res.locals.jwt.email);
            const salt = crypto_1.default.createSecretKey(Buffer.from(res.locals.jwt.refreshKey.data));
            const hash = crypto_1.default
                .createHmac('sha512', salt)
                .update(res.locals.jwt.userId + jwtSecret)
                .digest('base64');
            if (hash === req.body.refreshToken) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    provider: 'email',
                    permissionLevel: user.permissionLevel,
                };
                return next();
            }
            else {
                return res.status(400).send({ errors: ['Invalid refresh token'] });
            }
        });
    }
    validJWTNeeded(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.refreshToken) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(req.body.refreshToken, configs_1.auth.JWT_REFRESH_SECRET);
                    req.user = decoded;
                    // @ts-ignore
                    const rftRedis = yield redis_service_1.default.get(decoded.sub.toString());
                    if (rftRedis === null) {
                        return res.status(401).json({ status: false, message: "Invalid request. Token is not in store." });
                    }
                    // @ts-ignore
                    if (JSON.parse(rftRedis).token !== req.body.refreshToken) {
                        return res.status(401).json({ status: false, message: "Invalid request. Token is not same in store." });
                    }
                    next();
                }
                catch (err) {
                    return res.status(403).send();
                }
            }
            else {
                return res.status(401).send();
            }
        });
    }
    /**
     * Verify token of request
     * */
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.headers.authorization) {
                    return (0, http_middleware_1.responseUnauthorized)(res, 'No token !');
                }
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jsonwebtoken_1.default.verify(token, configs_1.auth.JWT_SECRET);
                req.user = decoded;
                // @ts-ignore
                req.token = token;
                // verify blacklisted access token.
                const tokenBL = yield redis_service_1.default.get(`BL_${decoded.sub}`);
                if (tokenBL && tokenBL === token) {
                    return (0, http_middleware_1.responseUnauthorized)(res, 'Blacklisted token !');
                }
                next();
            }
            catch (error) {
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    /**
     * Verify token of firebase
     * */
    verifyTokenV2(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.headers.authorization) {
                    return (0, http_middleware_1.responseUnauthorized)(res, 'No token !');
                }
                const token = req.headers.authorization.split(' ')[1];
                yield firebase_admin_1.default.auth().verifyIdToken(token)
                    .then((decodedToken) => __awaiter(this, void 0, void 0, function* () {
                    const { uid, email, name, firebase } = decodedToken;
                    req.user = { providerUID: uid, email, name, provider: 'provider' };
                    next();
                }))
                    .catch((error) => {
                    // Handle error
                    return (0, http_middleware_1.responseError)(res, error);
                });
            }
            catch (error) {
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
}
exports.default = new JwtMiddleware();
