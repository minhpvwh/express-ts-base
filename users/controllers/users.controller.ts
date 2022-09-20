import express from 'express';
import usersService from '../services/users.service';
import argon2 from 'argon2';
import debug from 'debug';
import { PatchUserDto } from '../dto/patch.user.dto';
import {
    responseError,
    responseHasData,
    responseNotFound,
    responseSimple
} from "../../common/middleware/http.middleware";
import BaseController from "../../base/controllers/base.controller";
import {saveImage} from "../../common/utils/file.util";
import {serverConfigs} from "../../configs";

const log: debug.IDebugger = debug('app:users-controller');

class UsersController extends BaseController {
    service = usersService;

    /**
     * Create user on firebase
     * */
    async createV2(req: express.Request, res: express.Response) {
        try {
            if (req.body.image) {
                // @ts-ignore
                const {path} = await saveImage(req.body.image, false, "avatars");
                req.body.avatarPath = path;
                req.body.avatarUrl = path.replace(serverConfigs.IMAGE_FOLDER, serverConfigs.IMAGE_URL);
            }
            await this.service.createV2(req);
            return responseSimple(res);
        } catch (error) {
            log('userController:createV2--->', error);
            return responseError(res, error);
        }
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.params.userId);
        if (!user) {
            return responseNotFound(res, 'user');
        }
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        try {
            req.body.password = await argon2.hash(req.body.password);
            const userId = await usersService.create(req.body);
            res.status(201).send({ id: userId });
        } catch (err) {
            return responseError(res, err);
        }
    }

    async me(req: express.Request, res: express.Response) {
        try {
            // @ts-ignore
            const query = {_id: req.user.sub};
            const populate: any[] = [];
            const fields = '';
            // @ts-ignore
            let rs = await this.service.get(query, {populate, fields});
            return responseHasData(res, rs);
        } catch (error) {
            log('USERS:user.controller:me--->', error);
            return responseError(res, error);
        }
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await usersService.patchById(req.params.userId, req.body));
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        log(await usersService.putById(req.params.userId, req.body));
        res.status(204).send();
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await usersService.deleteById(req.params.userId));
        res.status(204).send();
    }

    async updatePermissionLevel(req: express.Request, res: express.Response) {
        const patchUserDto: PatchUserDto = {
            permissionLevel: parseInt(req.params.permissionLevel),
        };
        log(await usersService.patchById(req.params.userId, patchUserDto));
        res.status(204).send();
    }

    async update(req: express.Request, res: express.Response) {
        try {
            const query = {_id: req.params['id']};
            const select = '';
            if (req.body.password) {
                req.body.password = await argon2.hash(req.body.password);
            }
            if (req.body.image) {
                // @ts-ignore
                const {path} = await saveImage(req.body.image, false, "avatars");
                req.body.avatarPath = path;
                req.body.avatarUrl = path.replace(serverConfigs.IMAGE_FOLDER, serverConfigs.IMAGE_URL);
            }
            await this.service.update(query, req.body, {select});
            return responseSimple(res);
        } catch (error) {
            log('BASE:base:update--->', error);
            return responseError(res, error);
        }
    }
}

export default new UsersController();
