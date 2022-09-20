import { CommonRoutesConfig } from '../common/common.routes.config';
import DemoController from './controllers/demo.controller';
import DemoMiddleware from './middlewares/demo.middleware';
import {serverConfigs} from '../configs';
import express from 'express';

export class DemoRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'DemoRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`${serverConfigs.API_VERSION}/demos`)
            .get(
                (req, res) => DemoController.getAll(req, res)
            )
            .post(
                (req, res) => DemoController.create(req, res)
            );

        this.app.param(`id`, DemoMiddleware.extractId);
        this.app
            .route(`${serverConfigs.API_VERSION}/demos/:id`)
            .all(
                // UsersMiddleware.validateUserExists,
                // jwtMiddleware.validJWTNeeded,
                // permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get((req, res) => DemoController.get(req, res))
            .put((req, res) => DemoController.update(req, res))
            .delete((req, res) => DemoController.delete(req, res));

        return this.app;
    }
}
