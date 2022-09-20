"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const demo_service_1 = __importDefault(require("../services/demo.service"));
const debug_1 = __importDefault(require("debug"));
const base_controller_1 = __importDefault(require("../../base/controllers/base.controller"));
const log = (0, debug_1.default)('app:demo-controller');
class DemoController extends base_controller_1.default {
    constructor() {
        super(...arguments);
        this.service = demo_service_1.default;
    }
}
exports.default = new DemoController();
