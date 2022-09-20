import {Response} from "express";
import {ICustomResponse} from "../interfaces/http.interface";

class CustomResponseSimple implements ICustomResponse {
    code: number;
    message: string;
    transactionTime: any;

    constructor(code: any = 200, message: any = 'success', transactionTime: any =  new Date()) {
        this.code = code;
        this.message = message;
        this.transactionTime = transactionTime;
    }
}

class CustomResponseHasData implements ICustomResponse {
    code: number;
    message: string;
    data: any;
    transactionTime: any;

    constructor(data: any = {}) {
        this.code = 200;
        this.message = 'success';
        this.data = data;
        this.transactionTime = new Date();
    }
}

class CustomResponsePagination implements ICustomResponse {
    code: number;
    message: string;
    meta: any;
    data: any;
    transactionTime: any;

    constructor(data: any = {}) {
        this.code = 200;
        this.message = 'success';
        this.meta = data.meta;
        this.data = data.data;
        this.transactionTime = new Date();
    }
}

class CustomErrorSimple implements ICustomResponse {
    code: number;
    message: string;
    transactionTime: any;

    constructor(message: any = 'Internal Error') {
        this.code = -1;
        this.message = message;
        this.transactionTime = new Date();
    }
}

class CustomErrorHasErrors implements ICustomResponse {
    code: number;
    message: string;
    errors: any;
    transactionTime: any;

    constructor(message: any = 'Internal Error', errors: any = '') {
        this.code = -1;
        this.message = message;
        this.errors = errors;
        this.transactionTime = new Date();
    }
}

export const responseSimple = (
    res: Response
) => {
    return res.status(200).send(new CustomResponseSimple());
};

export const responseHasData = (
    res: Response,
    data: any
) => {
    return res.status(200).send(new CustomResponseHasData(data));
};

export const responsePagination = (
    res: Response,
    data: any
) => {
    return res.status(200).send(new CustomResponsePagination(data));
};

export const responseInvalid = (
    res: Response,
    message: string
) => {
    return res.status(400).send(new CustomErrorSimple(message));
}

export const responseUnauthorized = (
    res: Response,
    message: any
) => {
    return res.status(401).send(new CustomErrorSimple(message));
}

export const responseNoPermission = (
    res: Response
) => {
    const message = '';
    return res.status(403).send(new CustomErrorSimple(message));
}

export const responseNotFound = (
    res: Response,
    objName: string
) => {
    const message = `${objName}.notFound`;
    return res.status(404).send(new CustomErrorSimple(message));
}

export const responseError = (
    res: Response,
    errors: any
) => {
    console.log('err:', errors);
    let statusCode = 500;
    let message = 'server.error';
    if (Array.isArray(errors)) {
        for (const err of errors) {
            switch (err.msg) {
                case 'Invalid value':
                    statusCode = 400;
                    message = `${err.param}.invalid`
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
            return res.status(statusCode).send(new CustomErrorSimple(message))
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
}



