"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const users_service_1 = __importDefault(require("../../users/services/users.service"));
const argon2 = __importStar(require("argon2"));
const http_middleware_1 = require("../../common/middleware/http.middleware");
class AuthMiddleware {
    validateBodyRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body && req.body.email && req.body.password) {
                next();
            }
            else {
                res.status(400).send({
                    errors: ['Missing required fields: email and password'],
                });
            }
        });
    }
    verifyUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByEmailWithPassword(req.body.email);
            if (user) {
                const passwordHash = user.password;
                if (yield argon2.verify(passwordHash, req.body.password)) {
                    req.user = user;
                    return next();
                }
                else {
                    return (0, http_middleware_1.responseUnauthorized)(res, 'Password wrong !');
                }
            }
            else {
                return (0, http_middleware_1.responseNotFound)(res, 'user');
            }
        });
    }
    /**
     * Login using firebase
     * */
    verifyUserPasswordV2(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield users_service_1.default.getUserByEmailWithPassword(email);
            if (user) {
                const passwordHash = user.password;
                if (yield argon2.verify(passwordHash, password)) {
                    req.user = user;
                    return next();
                }
                else {
                    return (0, http_middleware_1.responseUnauthorized)(res, 'Password wrong !');
                }
            }
            else {
                return (0, http_middleware_1.responseNotFound)(res, 'user');
            }
            // const auth = getAuth();
            // await signInWithEmailAndPassword(auth, email, password)
            //     .then(async (userCredential) => {
            //         // Signed in
            //         if (userCredential.user) {
            //             const user: any = await usersService.getUserByEmailWithPassword(
            //                 email
            //             );
            //             if (user) {
            //                 const passwordHash = user.password;
            //                 if (await argon2.verify(passwordHash, req.body.password)) {
            //                     req.user = user;
            //                     return next();
            //                 } else {
            //                     return responseUnauthorized(res, 'Password wrong !');
            //                 }
            //             } else {
            //                 return responseNotFound(res, 'user');
            //             }
            //         }
            //         return responseNotFound(res, 'userCredential');
            //     })
            //     .catch((error) => {
            //         const errorCode = error.code;
            //         const errorMessage = error.message;
            //         return responseError(res, error);
            //     });
        });
    }
}
exports.default = new AuthMiddleware();
