"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseError = exports.responseNotFound = exports.responseNoPermission = exports.responseUnauthorized = exports.responseInvalid = exports.responsePagination = exports.responseHasData = exports.responseSimple = void 0;
class CustomResponseSimple {
    constructor(code = 200, message = 'success', transactionTime = new Date()) {
        this.code = code;
        this.message = message;
        this.transactionTime = transactionTime;
    }
}
class CustomResponseHasData {
    constructor(data = {}) {
        this.code = 200;
        this.message = 'success';
        this.data = data;
        this.transactionTime = new Date();
    }
}
class CustomResponsePagination {
    constructor(data = {}) {
        this.code = 200;
        this.message = 'success';
        this.meta = data.meta;
        this.data = data.data;
        this.transactionTime = new Date();
    }
}
class CustomErrorSimple {
    constructor(message = 'Internal Error') {
        this.code = -1;
        this.message = message;
        this.transactionTime = new Date();
    }
}
class CustomErrorHasErrors {
    constructor(message = 'Internal Error', errors = '') {
        this.code = -1;
        this.message = message;
        this.errors = errors;
        this.transactionTime = new Date();
    }
}
const responseSimple = (res) => {
    return res.status(200).send(new CustomResponseSimple());
};
exports.responseSimple = responseSimple;
const responseHasData = (res, data) => {
    return res.status(200).send(new CustomResponseHasData(data));
};
exports.responseHasData = responseHasData;
const responsePagination = (res, data) => {
    return res.status(200).send(new CustomResponsePagination(data));
};
exports.responsePagination = responsePagination;
const responseInvalid = (res, message) => {
    return res.status(400).send(new CustomErrorSimple(message));
};
exports.responseInvalid = responseInvalid;
const responseUnauthorized = (res, message) => {
    return res.status(401).send(new CustomErrorSimple(message));
};
exports.responseUnauthorized = responseUnauthorized;
const responseNoPermission = (res) => {
    const message = '';
    return res.status(403).send(new CustomErrorSimple(message));
};
exports.responseNoPermission = responseNoPermission;
const responseNotFound = (res, objName) => {
    const message = `${objName}.notFound`;
    return res.status(404).send(new CustomErrorSimple(message));
};
exports.responseNotFound = responseNotFound;
const responseError = (res, errors) => {
    console.log('err:', errors);
    let statusCode = 500;
    let message = 'server.error';
    if (Array.isArray(errors)) {
        for (const err of errors) {
            switch (err.msg) {
                case 'Invalid value':
                    statusCode = 400;
                    message = `${err.param}.invalid`;
                    break;
            }
            return res.status(statusCode).send(new CustomErrorSimple(message));
        }
    }
    if (typeof errors === 'object') {
        if (errors.code) {
            statusCode = 400;
            message = errors.message;
            switch (message) {
                case 'Firebase: Error (auth/email-already-in-use).':
                    message = 'Email already in use !';
                    break;
                case 'Firebase: Error (auth/user-not-found).':
                    message = 'User not found !';
                    break;
            }
            return res.status(statusCode).send(new CustomErrorSimple(message));
        }
        if (errors.errors) {
            for (const key in errors.errors) {
                const err = errors.errors[key];
                switch (err.kind) {
                    case 'required':
                        statusCode = 400;
                        message = `${key}.required`;
                        break;
                    case 'enum':
                        statusCode = 400;
                        message = `${key}.invalid`;
                        break;
                    case 'unique':
                        statusCode = 400;
                        message = `${key}.existed`;
                        break;
                    case 'maxlength':
                        statusCode = 400;
                        message = `${key}.maxLength`;
                        break;
                    case 'minlength':
                        statusCode = 400;
                        message = `${key}.minLength`;
                        break;
                    case 'max':
                        statusCode = 400;
                        message = `${key}.maxNumber`;
                        break;
                    case 'min':
                        statusCode = 400;
                        message = `${key}.minNumber`;
                        break;
                    case 'user defined':
                        statusCode = 400;
                        message = `${key}.required`;
                        if (err.message === "invalid") {
                            message = `${key}.invalid`;
                        }
                        break;
                    case 'ObjectId':
                        statusCode = 400;
                        message = `${err.path}.notFound`;
                        break;
                }
                return res.status(statusCode).send(new CustomErrorSimple(message));
            }
        }
        if (errors.message && errors.message === 'jwt expired') {
            return res.status(401).send(new CustomErrorSimple(errors.message));
        }
    }
    return res.status(statusCode).send(new CustomErrorHasErrors(message, errors));
};
exports.responseError = responseError;
