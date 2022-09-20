import { CommonRoutesConfig } from '../common/common.routes.config';
import authController from './controllers/auth.controller';
import jwtMiddleware from './middleware/jwt.middleware';
import authMiddleware from './middleware/auth.middleware';
import express from 'express';
import {body} from 'express-validator/src';
import BodyValidationMiddleware from "../common/validations/body.validation.middleware";
// import passport from "passport";
import {serverConfigs} from '../configs';
import UsersMiddleware from "../users/middleware/users.middleware";
import UsersController from "../users/controllers/users.controller";

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes(): express.Application {
        this.app.post(`${serverConfigs.API_VERSION}/auth/login`, [
            body('email').exists().isEmail(),
            body('password').exists(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            authMiddleware.verifyUserPasswordV2,
            authController.createJWT,
        ]);
        this.app.post(`${serverConfigs.API_VERSION}/auth/token`, [
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.validJWTNeeded,
            // jwtMiddleware.validRefreshNeeded,
            authController.getAccessToken,
        ]);
        this.app.post(`${serverConfigs.API_VERSION}/auth/register`, [
            body('email').exists().isEmail(),
            body('password').exists(),
            body('name').exists(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameEmailDoesntExist,
            UsersMiddleware.preProcessCreateUser,
            (req: express.Request, res: express.Response) => UsersController.createV2(req, res)
        ]);
        this.app.get(`${serverConfigs.API_VERSION}/auth/logout`, [
            jwtMiddleware.verifyToken,
            authController.logout
        ]);
        this.app.get(`${serverConfigs.API_VERSION}/auth/me`, [
            jwtMiddleware.verifyToken,
            (req: express.Request, res: express.Response) => UsersController.me(req, res)
        ]);
        // this.app.get(`${serverConfigs.API_VERSION}/auth/facebook`, [
        //     passport.authenticate('facebook', { scope: 'email' })
        // ]);
        // this.app.get(`${serverConfigs.API_VERSION}/auth/google`, [
        //     passport.authenticate('google', { scope: ['profile', 'email'] })
        // ]);
        this.app.get(`${serverConfigs.API_VERSION}/auth/provider/callback`, [
            jwtMiddleware.verifyTokenV2,
            authController.createJWTOauth2V2
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
