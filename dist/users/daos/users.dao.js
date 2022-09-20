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
const debug_1 = __importDefault(require("debug"));
const user_model_1 = __importDefault(require("../models/user.model"));
const log = (0, debug_1.default)('app:users-dao');
class UsersDao {
    // Schema = mongooseService.getMongoose().Schema;
    //
    // userSchema = new this.Schema({
    //     _id: String,
    //     email: {required: true, type: String, unique: true},
    //     password: { type: String, select: false },
    //     firstName: String,
    //     lastName: String,
    //     permissionLevel: Number,
    // });
    //
    // User = mongooseService.getMongoose().model('Users', this.userSchema);
    constructor() {
        log('Created new instance of UsersDao');
    }
    addUser(userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            // const userId = shortid.generate();
            const user = new user_model_1.default(Object.assign({ permissionLevel: 1 }, userFields));
            yield user.save();
            return user._id;
        });
    }
    addUserWithoutPassword(userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_model_1.default(Object.assign({}, userFields));
            yield user.save();
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ email: email }).exec();
        });
    }
    getUserByProviderUID(providerUID) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ providerUID }).exec();
        });
    }
    getUserByEmailWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ email: email })
                .select('_id email role provider +password')
                .exec();
        });
    }
    getUserByIdAndEmail(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ _id: id, email }).lean();
        });
    }
    removeUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.deleteOne({ _id: userId }).exec();
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.findOne({ _id: userId }).populate('User').exec();
        });
    }
    getUsers(limit = 25, page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.default.find()
                .limit(limit)
                .skip(limit * page)
                .exec();
        });
    }
    updateUserById(userId, userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield user_model_1.default.findOneAndUpdate({ _id: userId }, { $set: userFields }, { new: true }).exec();
            return existingUser;
        });
    }
}
exports.default = new UsersDao();
