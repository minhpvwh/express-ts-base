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
Object.defineProperty(exports, "__esModule", { value: true });
const helper_util_1 = require("../../common/utils/helper.util");
const constants_util_1 = require("../../common/utils/constants.util");
const ObjectId = require('mongoose').Types.ObjectId;
class BaseService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    /**
     * params: fieldSchemaCustom(array)
     * */
    queryCondition(query, { fieldSchemaCustom = [] } = {}) {
        const fieldSchema = this.getFieldSchema(query);
        if ((0, helper_util_1.isEmpty)(fieldSchemaCustom)) {
            // @ts-ignore
            fieldSchemaCustom = fieldSchema.keysData;
        }
        if ("search" in query) {
            const querySearch = [];
            for (const field of fieldSchemaCustom) {
                querySearch.push({ [field]: new RegExp(query.search.trim(), 'i') });
            }
            query.$or = querySearch;
            delete query["search"];
        }
        for (const i in fieldSchema.data) {
            query[i] = { $regex: `${query[i].trim()}`, $options: 'i' };
        }
        for (const i in fieldSchema.dataEnum) {
            query[i] = `${query[i].trim()}`;
        }
        for (const i in fieldSchema.dataObjectId) {
            query[i] = ObjectId(`${query[i].trim()}`);
        }
        return query;
    }
    getFieldSchema(body, { parentKeys = '', model = this.model } = {}) {
        const data = {};
        let keysData = [];
        const dataEnum = {};
        const dataObjectId = {};
        const keys = Object.keys(model.schema.obj);
        keys.map(key => {
            // @ts-ignore
            if (body.hasOwnProperty(key)) {
                if (model.schema.path(key).instance === 'String') {
                    // @ts-ignore
                    if ((0, helper_util_1.isEmpty)(model.schema.path(key).enumValues)) {
                        data[`${parentKeys}${key}`] = body[key];
                        // @ts-ignore
                    }
                    else if (model.schema.path(key).enumValues.length > 0) {
                        dataEnum[`${parentKeys}${key}`] = body[key];
                    }
                }
                if (model.schema.path(key).instance === 'Mixed') {
                    dataObjectId[`${parentKeys}${key}`] = body[key];
                }
            }
            // @ts-ignore
            if (model.schema.path(key).instance === 'String') {
                keysData.push(`${parentKeys}${key}`);
            }
        });
        return { keysData, data, dataEnum, dataObjectId };
    }
    getAll(req, { fieldSchemaCustom = [], populate = [], isCount = true, isFull = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let { query, fields, page, size, sorts, options } = (0, helper_util_1.exportParams)(req);
            if (Object.keys(query).length > 0) {
                query = yield this.queryCondition(query, { fieldSchemaCustom });
            }
            if (isFull) {
                options = {};
            }
            const data = yield this.model.find(query, fields, options).sort(sorts).lean().populate(populate);
            if (!isCount || isFull) {
                return { data };
            }
            const count = yield this.model.countDocuments(query);
            const totalPage = size > 0 ? Math.ceil((count / size)) : 0;
            const meta = { count, size, totalPage, page };
            return { meta, data };
        });
    }
    get(query, { populate = [], fields = '' }) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.model.findOne(query, fields).lean().populate(populate);
            if (!rs) {
                throw constants_util_1.errors.NOT_FOUND_OBJECT;
            }
            return rs;
        });
    }
    update(query, data, { select = '' } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.model.findOneAndUpdate(query, data, { new: true, select, runValidators: true, context: 'query' });
            if (!rs) {
                throw constants_util_1.errors.NOT_FOUND_OBJECT;
            }
            return rs;
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.model.findOneAndRemove(query);
            if (!rs) {
                throw constants_util_1.errors.NOT_FOUND_OBJECT;
            }
            return {};
        });
    }
}
exports.default = BaseService;
