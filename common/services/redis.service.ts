import {createClient} from 'redis';
import debug from 'debug';
import {redis} from '../../configs';

const log: debug.IDebugger = debug('app:redis-service');

const redisUrl = `redis://${redis.REDIS_USERNAME}:${redis.REDIS_PASSWORD}@${redis.REDIS_HOST}:${redis.REDIS_PORT}/0`;
const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    let count = 0;
    try {
        await redisClient.connect();
        log('Redis client connected...');
        console.log('✅ 💃 Redis client connected...');
    } catch (err: any) {
        const retrySeconds = 5;
        console.log(err.message);
        log(
            `Redis connection unsuccessful (will retry #${++count} after ${retrySeconds} seconds):`,
            err
        );
        setTimeout(connectRedis, 5000);
    }
};

connectRedis();

redisClient.on('error', (err) => console.log('Redis Client Error:', err));

redisClient.on("ready", () => {
    console.log('✅ 💃 redis have ready !');
})

export default redisClient;




