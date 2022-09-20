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
const users_dao_1 = __importDefault(require("../daos/users.dao"));
const user_model_1 = __importDefault(require("../models/user.model"));
const base_service_1 = __importDefault(require("../../base/services/base.service"));
const auth_1 = require("firebase/auth");
const argon2_1 = __importDefault(require("argon2"));
class UsersService extends base_service_1.default {
    constructor() {
        super(...arguments);
        this.model = user_model_1.default;
    }
    // async create(resource: CreateUserDto) {
    //     resource.permissionLevel = 8;
    //     return UsersDao.addUser(resource);
    // }
    /**
     * Create user on firebase
     * */
    createV2(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const auth = (0, auth_1.getAuth)();
            yield (0, auth_1.createUserWithEmailAndPassword)(auth, email, password)
                .then((userCredential) => __awaiter(this, void 0, void 0, function* () {
                // Signed in
                const user = userCredential.user;
                req.body.providerUID = user.uid;
                req.body.password = yield argon2_1.default.hash(req.body.password);
                return yield this.model.create(req.body);
            }))
                .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                throw error;
            });
        });
    }
    ;
    // @ts-ignore
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.removeUserById(id);
        });
    }
    patchById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.updateUserById(id, resource);
        });
    }
    putById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.updateUserById(id, resource);
        });
    }
    readById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.getUserById(id);
        });
    }
    updateById(id, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.updateUserById(id, resource);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.getUserByEmail(email);
        });
    }
    getUserByEmailWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_dao_1.default.getUserByEmailWithPassword(email);
        });
    }
}
exports.default = new UsersService();
