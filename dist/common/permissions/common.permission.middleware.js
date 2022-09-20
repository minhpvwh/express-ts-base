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
const common_permissionlevel_enum_1 = require("../enums/common.permissionlevel.enum");
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('app:common-permission-middleware');
class CommonPermissionMiddleware {
    minimumPermissionLevelRequired(requiredPermissionLevel) {
        return (req, res, next) => {
            try {
                const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
                if (userPermissionLevel & requiredPermissionLevel) {
                    next();
                }
                else {
                    res.status(403).send();
                }
            }
            catch (e) {
                log(e);
            }
        };
    }
    onlySameUserOrAdminCanDoThisAction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
            if (req.params &&
                req.params.userId &&
                req.params.userId === res.locals.jwt.userId) {
                return next();
            }
            else {
                if (userPermissionLevel & common_permissionlevel_enum_1.PermissionLevel.ADMIN_PERMISSION) {
                    return next();
                }
                else {
                    return res.status(403).send();
                }
            }
        });
    }
    onlyAdminCanDoThisAction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
            if (userPermissionLevel & common_permissionlevel_enum_1.PermissionLevel.ADMIN_PERMISSION) {
                return next();
            }
            else {
                return res.status(403).send();
            }
        });
    }
}
exports.default = new CommonPermissionMiddleware();
