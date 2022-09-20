"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoRoutes = void 0;
const common_routes_config_1 = require("../common/common.routes.config");
const demo_controller_1 = __importDefault(require("./controllers/demo.controller"));
const demo_middleware_1 = __importDefault(require("./middlewares/demo.middleware"));
const configs_1 = require("../configs");
class DemoRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'DemoRoutes');
    }
    configureRoutes() {
        this.app
            .route(`${configs_1.serverConfigs.API_VERSION}/demos`)
            .get((req, res) => demo_controller_1.default.getAll(req, res))
            .post((req, res) => demo_controller_1.default.create(req, res));
        this.app.param(`id`, demo_middleware_1.default.extractId);
        this.app
            .route(`${configs_1.serverConfigs.API_VERSION}/demos/:id`)
            .all(
        // UsersMiddleware.validateUserExists,
        // jwtMiddleware.validJWTNeeded,
        // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
        )
            .get((req, res) => demo_controller_1.default.get(req, res))
            .put((req, res) => demo_controller_1.default.update(req, res))
            .delete((req, res) => demo_controller_1.default.delete(req, res));
        return this.app;
    }
}
exports.DemoRoutes = DemoRoutes;
