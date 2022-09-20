import express from "express";
import {exportParams, isEmpty} from "../../common/utils/helper.util";

import {errors} from '../../common/utils/constants.util';
import { CRUD } from '../../common/interfaces/crud.interface';
const ObjectId = require('mongoose').Types.ObjectId;

abstract class BaseService implements CRUD {
    abstract model: any

    async create(data: any) {
        return await this.model.create(data);
    }

    /**
     * params: fieldSchemaCustom(array)
     * */
    queryCondition(query: any, {fieldSchemaCustom = []} = {}) {
        const fieldSchema = this.getFieldSchema(query);
        if (isEmpty(fieldSchemaCustom)) {
            // @ts-ignore
            fieldSchemaCustom = fieldSchema.keysData;
        }
        if ("search" in query) {
            const querySearch = [];
            for (const field of fieldSchemaCustom) {
                querySearch.push({[field]: new RegExp(query.search.trim(), 'i')})
            }
            query.$or = querySearch;
            delete query["search"];
        }
        for (const i in fieldSchema.data) {
            query[i] = {$regex: `${query[i].trim()}`, $options: 'i'};
        }
        for (const i in fieldSchema.dataEnum) {
            query[i] = `${query[i].trim()}`;
        }
        for (const i in fieldSchema.dataObjectId) {
            query[i] = ObjectId(`${query[i].trim()}`);
        }
        return query;
    }

    getFieldSchema(body: any, {parentKeys = '', model = this.model} = {}) {
        const data: any = {};
        let keysData: any[] = [];
        const dataEnum: any = {};
        const dataObjectId: any = {};
        const keys = Object.keys(model.schema.obj);
        keys.map(key => {
            // @ts-ignore
            if (body.hasOwnProperty(key)) {
                if (model.schema.path(key).instance === 'String') {
                    // @ts-ignore
                    if (isEmpty(model.schema.path(key).enumValues)) {
                        data[`${parentKeys}${key}`] = body[key];
                        // @ts-ignore
                    } else if (model.schema.path(key).enumValues.length > 0) {
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
        return {keysData, data, dataEnum, dataObjectId};
    }

    async getAll(req: express.Request, {fieldSchemaCustom = [], populate = [], isCount = true, isFull = false}={}) {
        let {query, fields, page, size, sorts, options} = exportParams(req);
        if (Object.keys(query).length > 0) {
            query = await this.queryCondition(query, {fieldSchemaCustom});
        }
        if (isFull) {
            options = {};
        }
        const data = await this.model.find(query, fields, options).sort(sorts).lean().populate(populate);
        if (!isCount || isFull) {
            return {data};
        }
        const count = await this.model.countDocuments(query);
        const totalPage = size > 0 ? Math.ceil((count / size)) : 0;
        const meta = {count, size, totalPage, page};
        return {meta, data};
    }

    async get(query: any, {populate = [], fields = ''}) {
        const rs = await this.model.findOne(query, fields).lean().populate(populate);
        if (!rs) {
            throw errors.NOT_FOUND_OBJECT;  
        }
        return rs;
    }

    async update(query: any, data: any, {select = ''} = {}) {
        const rs = await this.model.findOneAndUpdate(query, data, {new: true, select, runValidators: true, context: 'query'});
        if (!rs) {
            throw errors.NOT_FOUND_OBJECT;
        }
        return rs;
    }

    async delete(query: any) {
        const rs = await this.model.findOneAndRemove(query);
        if (!rs) {
            throw errors.NOT_FOUND_OBJECT;
        }
        return {};
    }
}

export default BaseService;
