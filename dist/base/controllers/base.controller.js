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
const http_middleware_1 = require("../../common/middleware/http.middleware");
const log = (0, debug_1.default)('base:base-controller');
class BaseController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.create(req.body);
                return (0, http_middleware_1.responseSimple)(res);
            }
            catch (error) {
                log('BASE:base:create--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isFull = false;
                // remove comment if want get all full
                // if (!req.query.page && !req.query.size) {
                //   isFull = true;
                // }
                const populate = [];
                const fieldSchemaCustom = [];
                const rs = yield this.service.getAll(req, { populate, fieldSchemaCustom, isFull });
                return (0, http_middleware_1.responsePagination)(res, rs);
            }
            catch (error) {
                log('BASE:base:getAll--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { _id: req.params['id'] };
                const populate = [];
                const fields = '';
                const rs = yield this.service.get(query, { populate, fields });
                return (0, http_middleware_1.responseHasData)(res, rs);
            }
            catch (error) {
                log('BASE:base:get--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { _id: req.params['id'] };
                const select = '';
                yield this.service.update(query, req.body, { select });
                return (0, http_middleware_1.responseSimple)(res);
            }
            catch (error) {
                log('BASE:base:update--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { _id: req.params['id'] };
                yield this.service.delete(query);
                return (0, http_middleware_1.responseSimple)(res);
            }
            catch (error) {
                log('BASE:base:delete--->', error);
                return (0, http_middleware_1.responseError)(res, error);
            }
        });
    }
}
exports.default = BaseController;
