"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const users_controller_1 = __importDefault(require("./controllers/users.controller"));
const users_middleware_1 = __importDefault(require("./middleware/users.middleware"));
const jwt_middleware_1 = __importDefault(require("../auth/middleware/jwt.middleware"));
const body_validation_middleware_1 = __importDefault(require("../common/validations/body.validation.middleware"));
const express_validator_1 = require("express-validator");
const configs_1 = require("../configs");
class UsersRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'UsersRoutes');
    }
    configureRoutes() {
        this.app
            .route(`${configs_1.serverConfigs.API_VERSION}/users`)
            .get(jwt_middleware_1.default.verifyToken, 
        // permissionMiddleware.onlyAdminCanDoThisAction,
        (req, res) => users_controller_1.default.getAll(req, res));
        this.app.param(`id`, users_middleware_1.default.extractUserId);
        this.app
            .route(`${configs_1.serverConfigs.API_VERSION}/users/:id`)
            .all(
        // UsersMiddleware.validateUserExists,
        jwt_middleware_1.default.verifyToken)
            .get((req, res) => users_controller_1.default.get(req, res));
        // .delete((req, res) => UsersController.delete(req, res));
        this.app.put(`${configs_1.serverConfigs.API_VERSION}/users/:id`, [
            jwt_middleware_1.default.verifyToken,
            // body('email').isEmail(),
            (0, express_validator_1.check)('password').optional()
                .isLength({ min: 8 }),
            (0, express_validator_1.check)('firstName').optional().isString(),
            (0, express_validator_1.check)('lastName').optional().isString(),
            (0, express_validator_1.check)('name').optional().isString(),
            body_validation_middleware_1.default.verifyBodyFieldsErrors,
            // UsersMiddleware.validateSameEmailBelongToSameUser,
            // UsersMiddleware.userCantChangePermission,
            // permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            // permissionMiddleware.minimumPermissionLevelRequired(
            //     PermissionLevel.PAID_PERMISSION
            // ),
            users_middleware_1.default.preProcessUpdateUser,
            (req, res) => users_controller_1.default.update(req, res)
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
exports.UsersRoutes = UsersRoutes;
