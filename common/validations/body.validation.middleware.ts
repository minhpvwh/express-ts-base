import express from 'express';
import { validationResult } from 'express-validator';
import {responseError} from '../middleware/http.middleware';

class BodyValidationMiddleware {
    verifyBodyFieldsErrors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseError(res, errors.array());
        }
        next();
    }
}

export default new BodyValidationMiddleware();
