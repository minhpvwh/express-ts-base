import express from 'express';
import userService from '../services/users.service';
import {responseError, responseInvalid} from "../../common/middleware/http.middleware";

class UsersMiddleware {
    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields: email and password'],
            });
        }
    }

    async preProcessCreateUser (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        delete req.body.provider;
        delete req.body.avatarPath;
        delete req.body.avatarUrl;
        delete req.body.referCode;
        delete req.body.referUser;
        delete req.body.lastLogin;
        delete req.body.status;
        delete req.body.role;
        delete req.body.leaderId;
        next();
    }

    async preProcessUpdateUser (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        delete req.body.email;
        delete req.body.provider;
        delete req.body.avatarPath;
        delete req.body.avatarUrl;
        delete req.body.referCode;
        delete req.body.referUser;
        delete req.body.lastLogin;
        delete req.body.status;
        delete req.body.role;
        next();
    }

    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user) {
            // res.status(400).send({ errors: ['User email already exists'] });
            return responseInvalid(res, 'User email already exists');
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.getUserByEmail(req.body.email);
        if (user && user.id === req.params.id) {
            res.locals.user = user;
            next();
        } else {
            res.status(400).send({ errors: ['Invalid email'] });
        }
    }

    async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (res.locals.user.permissionLevel !== req.body.permissionLevel) {
            res.status(400).send({
                errors: ['User cannot change permission level'],
            });
        } else {
            next();
        }
    }

    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.email) {
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await userService.readById(req.params.userId);
        if (user) {
            next();
        } else {
            res.status(404).send({
                errors: [`User ${req.params.userId} not found`],
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.id;
        next();
    }
}

export default new UsersMiddleware();
