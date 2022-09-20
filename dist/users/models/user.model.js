"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_service_1 = __importDefault(require("../../common/services/mongoose.service"));
const mongoose_1 = require("mongoose");
const Schema = mongoose_service_1.default.getMongoose().Schema;
const userSchema = new Schema({
    _id: { type: mongoose_1.Types.ObjectId, auto: true },
    email: { required: true, type: String, unique: true },
    password: { type: String, select: false, minlength: 8 },
    name: { type: String, required: true },
    provider: { type: String, enum: ['provider', 'original'], default: 'original', lowercase: true },
    providerUID: { type: String },
    firstName: { type: String },
    wallet: { type: String },
    avatarUrl: { type: String },
    avatarPath: { type: String },
    role: { type: String, enum: ['ctv', 'leader', 'normal'], default: 'normal' },
    lastName: String,
    referCode: { type: String },
    referUser: { type: Object, ref: 'Users' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', lowercase: true },
    lastLogin: { type: Date },
    leader: { type: Object, ref: 'Users' }
}, { timestamps: true });
const User = mongoose_service_1.default.getMongoose().model('Users', userSchema);
exports.default = User;
