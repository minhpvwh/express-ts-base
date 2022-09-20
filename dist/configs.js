"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.s3BucketConfig = exports.firebaseConfig = exports.redis = exports.db = exports.serverConfigs = exports.auth = exports.domains = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotenvResult = dotenv_1.default.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}
exports.domains = {
    CURRENT_URL: process.env.CURRENT_URL || 'http://13.215.249.70:3000',
};
exports.auth = {
    JWT_SECRET: process.env.JWT_SECRET || 'My!@!Se3cr8tH4sh3',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'You!@!Se3cr8tH4sh3',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '30d',
    JWT_REFRESH_EXPIRATION_REDIS: process.env.JWT_REFRESH_EXPIRATION_REDIS || 30 * 24 * 3600,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '709671490255201',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '702623080308-jpp1eaftvfl64gqg36r97j7dlorhok75.apps.googleusercontent.com',
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || 'f18f6acd511242da9d8d5b696b7d565e',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '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',
};
exports.serverConfigs = {
    DEBUG: process.env.DEBUG || true,
    PORT: process.env.PORT || 3001,
    API_VERSION: process.env.API_VERSION || '/api/v1',
    IMAGE_FOLDER: __dirname + '/public/api/v1/images',
    IMAGE_URL: exports.domains.CURRENT_URL + '/api/v1/images',
    FILE_LINK: exports.domains.CURRENT_URL + '/api/v1/file-link',
};
exports.db = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fian-db'
};
exports.redis = {
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379
};
exports.firebaseConfig = {
    apiKey: "AIzaSyD9N_VWmQpo0a9gImjIWV7CZHgkm9v7gdU",
    authDomain: "fian-3417a.firebaseapp.com",
    projectId: "fian-3417a",
    storageBucket: "fian-3417a.appspot.com",
    messagingSenderId: "901367915707",
    appId: "1:901367915707:web:9f27107144ce0facd7759e",
    measurementId: "G-BCZ9PNY8P7"
};
exports.s3BucketConfig = {
    bucket: "fiant"
};
aws_sdk_1.default.config = new aws_sdk_1.default.Config({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION,
    signatureVersion: process.env.S3_SIGNATURE_VERION
});
exports.s3 = new aws_sdk_1.default.S3();
