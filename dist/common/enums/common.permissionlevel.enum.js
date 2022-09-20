"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BO_MODULE = exports.BO_ROLE = exports.PermissionLevel = void 0;
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel[PermissionLevel["FREE_PERMISSION"] = 1] = "FREE_PERMISSION";
    PermissionLevel[PermissionLevel["PAID_PERMISSION"] = 2] = "PAID_PERMISSION";
    PermissionLevel[PermissionLevel["ANOTHER_PAID_PERMISSION"] = 4] = "ANOTHER_PAID_PERMISSION";
    PermissionLevel[PermissionLevel["ADMIN_PERMISSION"] = 8] = "ADMIN_PERMISSION";
    PermissionLevel[PermissionLevel["SUDO_PERMISSION"] = 2147483647] = "SUDO_PERMISSION";
})(PermissionLevel = exports.PermissionLevel || (exports.PermissionLevel = {}));
var BO_ROLE;
(function (BO_ROLE) {
    BO_ROLE["SUPER_ADMIN"] = "SUPER_ADMIN";
    BO_ROLE["MOD"] = "MOD";
    BO_ROLE["ADMIN"] = "ADMIN";
})(BO_ROLE = exports.BO_ROLE || (exports.BO_ROLE = {}));
var BO_MODULE;
(function (BO_MODULE) {
    BO_MODULE["PROJECT"] = "PROJECT";
    BO_MODULE["SECTION"] = "SECTION";
    BO_MODULE["PROJECT_POST"] = "PROJECT_POST";
    BO_MODULE["PROJECT_IMAGE"] = "PROJECT_IMAGE";
    BO_MODULE["FILE_LINK"] = "FILE_LINK";
    BO_MODULE["UTILITY"] = "UTILITY";
    BO_MODULE["PROJECT_UTILITY"] = "PROJECT_UTILITY";
    BO_MODULE["BO_USER"] = "BO_USER";
    BO_MODULE["TRANSACTION"] = "TRANSACTION";
})(BO_MODULE = exports.BO_MODULE || (exports.BO_MODULE = {}));
