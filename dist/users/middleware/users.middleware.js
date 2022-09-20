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
const users_service_1 = __importDefault(require("../services/users.service"));
const http_middleware_1 = require("../../common/middleware/http.middleware");
class UsersMiddleware {
    constructor() {
        this.validatePatchEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.email) {
                this.validateSameEmailBelongToSameUser(req, res, next);
            }
            else {
                next();
            }
        });
    }
    validateRequiredUserBodyFields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body && req.body.email && req.body.password) {
                next();
            }
            else {
                res.status(400).send({
                    errors: ['Missing required fields: email and password'],
                });
            }
        });
    }
    preProcessCreateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    preProcessUpdateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    validateSameEmailDoesntExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByEmail(req.body.email);
            if (user) {
                // res.status(400).send({ errors: ['User email already exists'] });
                return (0, http_middleware_1.responseInvalid)(res, 'User email already exists');
            }
            else {
                next();
            }
        });
    }
    validateSameEmailBelongToSameUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByEmail(req.body.email);
            if (user && user.id === req.params.id) {
                res.locals.user = user;
                next();
            }
            else {
                res.status(400).send({ errors: ['Invalid email'] });
            }
        });
    }
    userCantChangePermission(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (res.locals.user.permissionLevel !== req.body.permissionLevel) {
                res.status(400).send({
                    errors: ['User cannot change permission level'],
                });
            }
            else {
                next();
            }
        });
    }
    validateUserExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.readById(req.params.userId);
            if (user) {
                next();
            }
            else {
                res.status(404).send({
                    errors: [`User ${req.params.userId} not found`],
                });
            }
        });
    }
    extractUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.id = req.params.id;
            next();
        });
    }
}
exports.default = new UsersMiddleware();
