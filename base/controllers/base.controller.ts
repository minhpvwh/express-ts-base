import express from "express";
import debug from "debug";
import {
    responseError,
    responseHasData,
    responsePagination,
    responseSimple
} from "../../common/middleware/http.middleware";

const log: debug.IDebugger = debug('base:base-controller');

abstract class BaseController {
    abstract service: any;

    async create(req: express.Request, res: express.Response) {
        try {
            await this.service.create(req.body);
            return responseSimple(res);
        } catch (error) {
            log('BASE:base:create--->', error);
            return responseError(res, error);
        }
    }

    async getAll(req: express.Request, res: express.Response) {
        try {
            let isFull = false;
            // remove comment if want get all full
            // if (!req.query.page && !req.query.size) {
            //   isFull = true;
            // }
            const populate: any[] = [];
            const fieldSchemaCustom: any[] = [];
            const rs = await this.service.getAll(req, {populate, fieldSchemaCustom, isFull});
            return responsePagination(res, rs);
        } catch (error) {
            log('BASE:base:getAll--->', error);
            return responseError(res, error);
        }
    }

    async get(req: express.Request, res: express.Response) {
        try {
            const query = {_id: req.params['id']};
            const populate: any[] = [];
            const fields = '';
            const rs = await this.service.get(query, {populate, fields});
            return responseHasData(res, rs);
        } catch (error) {
            log('BASE:base:get--->', error);
            return responseError(res, error);
        }
    }

    async update(req: express.Request, res: express.Response) {
        try {
            const query = {_id: req.params['id']};
            const select = '';
            await this.service.update(query, req.body, {select});
            return responseSimple(res);
        } catch (error) {
            log('BASE:base:update--->', error);
            return responseError(res, error);
        }
    }

    async delete(req: express.Request, res: express.Response) {
        try {
            const query = {_id: req.params['id']};
            await this.service.delete(query);
            return responseSimple(res);
        } catch (error) {
            log('BASE:base:delete--->', error);
            return responseError(res, error);
        }
    }

}

export default BaseController;
