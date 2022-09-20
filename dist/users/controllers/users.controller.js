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
const argon2_1 = __importDefault(require("argon2"));
const debug_1 = __importDefault(require("debug"));
const http_middleware_1 = require("../../common/middleware/http.middleware");
const base_controller_1 = __importDefault(require("../../base/controllers/base.controller"));
const file_util_1 = require("../../common/utils/file.util");
const configs_1 = require("../../configs");
const log = (0, debug_1.default)('app:users-controller');
class UsersController extends base_controller_1.default {
    constructor() {
        super(...arguments);
        this.service = users_service_1.default;
    }
    /**
     * Create user on firebase
     * */
    createV2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.image) {
                    // @ts-ignore
                    const { path } = yield (0, file_util_1.saveImage)(req.body.image, false, "avatars");
                    req.body.avatarPath = path;
                    req.body.avatarUrl = path.replace(configs_1.serverConfigs.IMAGE_FOLDER, configs_1.serverConfigs.IMAGE_URL);
                }
                yield this.service.createV2(req);
                return (0, http_middleware_1.responseSimple)(res);
            }
            catch (error) {
                log('userController:createV2--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.readById(req.params.userId);
            if (!user) {
                return (0, http_middleware_1.responseNotFound)(res, 'user');
            }
            res.status(200).send(user);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.password = yield argon2_1.default.hash(req.body.password);
                const userId = yield users_service_1.default.create(req.body);
                res.status(201).send({ id: userId });
            }
            catch (err) {
                return (0, http_middleware_1.responseError)(res, err);
            }
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const query = { _id: req.user.sub };
                const populate = [];
                const fields = '';
                // @ts-ignore
                let rs = yield this.service.get(query, { populate, fields });
                return (0, http_middleware_1.responseHasData)(res, rs);
            }
            catch (error) {
                log('USERS:user.controller:me--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    patch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.password) {
                req.body.password = yield argon2_1.default.hash(req.body.password);
            }
            log(yield users_service_1.default.patchById(req.params.userId, req.body));
            res.status(204).send();
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.password = yield argon2_1.default.hash(req.body.password);
            log(yield users_service_1.default.putById(req.params.userId, req.body));
            res.status(204).send();
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            log(yield users_service_1.default.deleteById(req.params.userId));
            res.status(204).send();
        });
    }
    updatePermissionLevel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const patchUserDto = {
                permissionLevel: parseInt(req.params.permissionLevel),
            };
            log(yield users_service_1.default.patchById(req.params.userId, patchUserDto));
            res.status(204).send();
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { _id: req.params['id'] };
                const select = '';
                if (req.body.password) {
                    req.body.password = yield argon2_1.default.hash(req.body.password);
                }
                if (req.body.image) {
                    // @ts-ignore
                    const { path } = yield (0, file_util_1.saveImage)(req.body.image, false, "avatars");
                    req.body.avatarPath = path;
                    req.body.avatarUrl = path.replace(configs_1.serverConfigs.IMAGE_FOLDER, configs_1.serverConfigs.IMAGE_URL);
                }
                yield this.service.update(query, req.body, { select });
                return (0, http_middleware_1.responseSimple)(res);
            }
            catch (error) {
                log('BASE:base:update--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
}
exports.default = new UsersController();
