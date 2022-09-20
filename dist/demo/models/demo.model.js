"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_service_1 = __importDefault(require("../../common/services/mongoose.service"));
const mongoose_1 = require("mongoose");
const Schema = mongoose_service_1.default.getMongoose().Schema;
const schema = new Schema({
    _id: { type: mongoose_1.Types.ObjectId, auto: true },
    name: { type: String }
});
const Demo = mongoose_service_1.default.getMongoose().model('Demos', schema);
exports.default = Demo;
