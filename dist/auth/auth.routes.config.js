"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const jwt_middleware_1 = __importDefault(require("./middleware/jwt.middleware"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const src_1 = require("express-validator/src");
const body_validation_middleware_1 = __importDefault(require("../common/validations/body.validation.middleware"));
// import passport from "passport";
const configs_1 = require("../configs");
const users_middleware_1 = __importDefault(require("../users/middleware/users.middleware"));
const users_controller_1 = __importDefault(require("../users/controllers/users.controller"));
class AuthRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'AuthRoutes');
    }
    configureRoutes() {
        this.app.post(`${configs_1.serverConfigs.API_VERSION}/auth/login`, [
            (0, src_1.body)('email').exists().isEmail(),
            (0, src_1.body)('password').exists(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            auth_middleware_1.default.verifyUserPasswordV2,
            auth_controller_1.default.createJWT,
        ]);
        this.app.post(`${configs_1.serverConfigs.API_VERSION}/auth/token`, [
            jwt_middleware_1.default.verifyRefreshBodyField,
            jwt_middleware_1.default.validJWTNeeded,
            // jwtMiddleware.validRefreshNeeded,
            auth_controller_1.default.getAccessToken,
        ]);
        this.app.post(`${configs_1.serverConfigs.API_VERSION}/auth/register`, [
            (0, src_1.body)('email').exists().isEmail(),
            (0, src_1.body)('password').exists(),
            (0, src_1.body)('name').exists(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            users_middleware_1.default.validateSameEmailDoesntExist,
            users_middleware_1.default.preProcessCreateUser,
            (req, res) => users_controller_1.default.createV2(req, res)
        ]);
        this.app.get(`${configs_1.serverConfigs.API_VERSION}/auth/logout`, [
            jwt_middleware_1.default.verifyToken,
            auth_controller_1.default.logout
        ]);
        this.app.get(`${configs_1.serverConfigs.API_VERSION}/auth/me`, [
            jwt_middleware_1.default.verifyToken,
            (req, res) => users_controller_1.default.me(req, res)
        ]);
        // this.app.get(`${serverConfigs.API_VERSION}/auth/facebook`, [
        //     passport.authenticate('facebook', { scope: 'email' })
        // ]);
        // this.app.get(`${serverConfigs.API_VERSION}/auth/google`, [
        //     passport.authenticate('google', { scope: ['profile', 'email'] })
        // ]);
        this.app.get(`${configs_1.serverConfigs.API_VERSION}/auth/provider/callback`, [
            jwt_middleware_1.default.verifyTokenV2,
            auth_controller_1.default.createJWTOauth2V2
        ]);
        // this.app.get(`${serverConfigs.API_VERSION}/auth/facebook/callback`, [
        //     passport.authenticate('facebook', { failureRedirect: '/login' }),
        //     authController.createJWTOauth2,
        // ]);
        // this.app.get(`${serverConfigs.API_VERSION}/auth/google/callback`, [
        //     passport.authenticate('google', {failureRedirect: '/login'}),
        //     authController.createJWTOauth2,
        // ]);
        return this.app;
    }
}
exports.AuthRoutes = AuthRoutes;
