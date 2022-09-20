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
exports.mkdirs = exports.saveImage = void 0;
const configs_1 = require("../../configs");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
function saveImage(image, makeThumbnail = true, prefix = "/") {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        let dir = `${configs_1.serverConfigs.IMAGE_FOLDER}/`;
        const dirThumbnail = `${configs_1.serverConfigs.IMAGE_FOLDER}/`;
        if (prefix === 'avatars') {
            dir = `${configs_1.serverConfigs.IMAGE_FOLDER}/${prefix}`;
        }
        yield mkdirs(dir);
        const fileName = `image-${date.getTime()}-${Math.floor(Math.random() * date.getTime())}`;
        return new Promise((resolve, reject) => {
            const imageTypeIndex = image.indexOf(";base64,");
            let imageExt = '.png';
            let base64Data = image;
            if (imageTypeIndex > 0) {
                const imageType = image.substring(0, imageTypeIndex);
                if (imageType.includes('jpeg')) {
                    imageExt = '.jpg';
                }
                base64Data = image.substring(imageTypeIndex + 8);
            }
            // let base64Data = image.replace(/^data:image\/\.+;base64,/, "");
            // console.log(base64Data)
            const path = `${dir}/${fileName}${imageExt}`;
            fs_1.default.writeFile(path, base64Data, 'base64', function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return reject(err);
                    }
                    if (!makeThumbnail) {
                        return resolve({ path });
                    }
                    try {
                        const thumbnailPath = `${dirThumbnail}/${fileName}-thumbnail${imageExt}`;
                        yield resizeImage(path, thumbnailPath);
                        return resolve({ path, thumbnailPath });
                    }
                    catch (error) {
                    }
                    return resolve({ path });
                });
            });
        });
    });
}
exports.saveImage = saveImage;
function resizeImage(filePath, thumbnailPath) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, sharp_1.default)(filePath)
            .resize(142, null)
            .toBuffer()
            .then((data) => {
            fs_1.default.writeFileSync(thumbnailPath, data);
        })
            .catch((error) => {
            console.log("statusRoute |  Error In Uploading Status Image" + error);
            throw error;
        });
    });
}
function mkdirs(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirs = path.split("/");
        let currentPath = dirs[0];
        for (let i = 1; i < dirs.length; i++) {
            if (!fs_1.default.existsSync(currentPath) && currentPath.trim()) {
                fs_1.default.mkdirSync(currentPath);
            }
            currentPath += "/" + dirs[i];
        }
        if (!fs_1.default.existsSync(currentPath) && currentPath.trim()) {
            fs_1.default.mkdirSync(currentPath);
        }
    });
}
exports.mkdirs = mkdirs;
