import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import jwtMiddleware from '../auth/middleware/jwt.middleware';
import BodyValidationMiddleware from '../common/validations/body.validation.middleware';
import { body, check } from 'express-validator';
import {serverConfigs} from "../configs";

import express from 'express';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`${serverConfigs.API_VERSION}/users`)
            .get(
                jwtMiddleware.verifyToken,
                // permissionMiddleware.onlyAdminCanDoThisAction,
                (req, res) => UsersController.getAll(req, res)
            );

        this.app.param(`id`, UsersMiddleware.extractUserId);
        this.app
            .route(`${serverConfigs.API_VERSION}/users/:id`)
            .all(
                // UsersMiddleware.validateUserExists,
                jwtMiddleware.verifyToken,
                // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get((req, res) => UsersController.get(req, res))
            // .delete((req, res) => UsersController.delete(req, res));

        this.app.put(`${serverConfigs.API_VERSION}/users/:id`, [
            jwtMiddleware.verifyToken,
            // body('email').isEmail(),
            check('password').optional()
                .isLength({ min: 8 }),
            check('firstName').optional().isString(),
            check('lastName').optional().isString(),
            check('name').optional().isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            // permissionMiddleware.minimumPermissionLevelRequired(
            //     PermissionLevel.PAID_PERMISSION
            // ),
            UsersMiddleware.preProcessUpdateUser,
            (req: express.Request, res: express.Response) => UsersController.update(req, res)
        ]);

        // this.app.patch(`/users/:userId`, [
        //     jwtMiddleware.validJWTNeeded,
        //     body('email').isEmail().optional(),
        //     body('password')
        //         .isLength({ min: 5 })
        //         .withMessage('Password must be 5+ characters')
        //         .optional(),
        //     body('firstName').isString().optional(),
        //     body('lastName').isString().optional(),
        //     body('permissionLevel').isInt().optional(),
        //     BodyValidationMiddleware.verifyBodyFieldsErrors,
        //     UsersMiddleware.validatePatchEmail,
        //     permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        //     permissionMiddleware.minimumPermissionLevelRequired(
        //         PermissionLevel.PAID_PERMISSION
        //     ),
        //     UsersController.patch,
        // ]);

        /**
         * This route is currently not requiring extra permissions. Please update it for admin usage in your own application.
         */
        // this.app.put(`/users/:userId/permissionLevel/:permissionLevel`, [
        //     jwtMiddleware.validJWTNeeded,
        //     permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        //     permissionMiddleware.minimumPermissionLevelRequired(
        //         PermissionLevel.FREE_PERMISSION
        //     ),
        //     UsersController.updatePermissionLevel,
        // ]);

        return this.app;
    }
}
