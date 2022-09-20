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
const redis_1 = require("redis");
const debug_1 = __importDefault(require("debug"));
const configs_1 = require("../../configs");
const log = (0, debug_1.default)('app:redis-service');
const redisUrl = `redis://${configs_1.redis.REDIS_USERNAME}:${configs_1.redis.REDIS_PASSWORD}@${configs_1.redis.REDIS_HOST}:${configs_1.redis.REDIS_PORT}/0`;
const redisClient = (0, redis_1.createClient)({
    url: redisUrl,
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    let count = 0;
    try {
        yield redisClient.connect();
        log('Redis client connected...');
        console.log('✅ 💃 Redis client connected...');
    }
    catch (err) {
        const retrySeconds = 5;
        console.log(err.message);
        log(`Redis connection unsuccessful (will retry #${++count} after ${retrySeconds} seconds):`, err);
        setTimeout(connectRedis, 5000);
    }
});
connectRedis();
redisClient.on('error', (err) => console.log('Redis Client Error:', err));
redisClient.on("ready", () => {
    console.log('✅ 💃 redis have ready !');
});
exports.default = redisClient;
