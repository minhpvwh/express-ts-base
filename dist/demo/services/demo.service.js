"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const demo_model_1 = __importDefault(require("../models/demo.model"));
const base_service_1 = __importDefault(require("../../base/services/base.service"));
class DemoService extends base_service_1.default {
    constructor() {
        super(...arguments);
        this.model = demo_model_1.default;
    }
}
exports.default = new DemoService();
