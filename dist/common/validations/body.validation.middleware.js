"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_middleware_1 = require("../middleware/http.middleware");
class BodyValidationMiddleware {
    verifyBodyFieldsErrors(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return (0, http_middleware_1.responseError)(res, errors.array());
        }
        next();
    }
}
exports.default = new BodyValidationMiddleware();
