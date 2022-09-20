import express from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import redisClient from '../../common/services/redis.service';
import {auth} from '../../configs';
import {responseError, responseHasData, responseSimple} from '../../common/middleware/http.middleware';
import UsersDao from "../../users/daos/users.dao";
import {JwtType} from "../../common/types/jwt.type";

const log: debug.IDebugger = debug('app:auth-controller');

const jwtSecret: string = auth.JWT_SECRET;
const jwtRefreshSecret: string = auth.JWT_REFRESH_SECRET;
const tokenExpirationInSeconds: any = auth.JWT_EXPIRATION;
const tokenRefreshExpirationInSeconds: any = auth.JWT_REFRESH_EXPIRATION;
const tokenRefreshExpirationRedisInSeconds: any = auth.JWT_REFRESH_EXPIRATION_REDIS;

class AuthController {
    async generateRefreshToken (data: any) {
        const refresh_token = jwt.sign(data, jwtRefreshSecret, { expiresIn: tokenRefreshExpirationInSeconds });
        await redisClient.set(data.sub, JSON.stringify({token: refresh_token}), { EX: tokenRefreshExpirationRedisInSeconds });
        return refresh_token;
    }

    async createJWT(req: express.Request, res: express.Response) {
        try {
            // @ts-ignore
            const {_id: sub, email, role, provider} = req.user;
            const jwtData = {
                sub: sub.toString(),
                email,
                provider,
                role
            } as JwtType;
            const accessToken = jwt.sign(jwtData, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
            });
            const refreshToken = await authController.generateRefreshToken(jwtData);
            return responseHasData( res, { accessToken, refreshToken });
        } catch (err) {
            log('createJWT error: %O', err);
            return responseError(res, err);
        }
    }

    async createJWTOauth2(req: express.Request, res: express.Response) {
        try {
            // @ts-ignore
            const {email} = req.user._json;
            let user = await UsersDao.getUserByEmail(email);
            if (!user) {
                // @ts-ignore
                user = await UsersDao.addUserWithoutPassword(req.user._json);
            }
            const jwtData = {
                sub: user._id.toString(),
                email: user.email,
                provider: user.provider,
                role: user.role
            } as JwtType;
            const accessToken = jwt.sign(jwtData, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
            });
            const refreshToken = await authController.generateRefreshToken(jwtData);
            return responseHasData( res, { accessToken, refreshToken });
        } catch (err) {
            log('createJWT error: %O', err);
            return responseError(res, err);
        }
    }

    async createJWTOauth2V2(req: express.Request, res: express.Response) {
        try {
            // @ts-ignore
            let {email, providerUID} = req.user;
            let user;
            if (email) {
                user = await UsersDao.getUserByEmail(email);
            } else {
                email = providerUID + '@ex.com';
                user = await UsersDao.getUserByProviderUID(providerUID);
            }
            if (!user) {
                // @ts-ignore
                user = await UsersDao.addUserWithoutPassword(req.user);
            }
            const jwtData = {
                sub: user._id.toString(),
                email: user.email,
                provider: user.provider,
                role: user.role,
                providerUID: user.providerUID
            } as JwtType;
            const accessToken = jwt.sign(jwtData, jwtSecret, {
                expiresIn: tokenExpirationInSeconds,
            });
            const refreshToken = await authController.generateRefreshToken(jwtData);
            return responseHasData( res, { accessToken, refreshToken });
        } catch (err) {
            log('createJWT error: %O', err);
            return responseError(res, err);
        }
    }

    async getAccessToken(req: express.Request, res: express.Response) {
        try {
            // @ts-ignore
            const {sub, email, provider, role} = req.user;
            const jwtData = {
                sub,
                email,
                provider,
                role
            } as JwtType;
            const access_token = jwt.sign(jwtData, jwtSecret, { expiresIn: tokenRefreshExpirationInSeconds });
            const refresh_token = await authController.generateRefreshToken(jwtData);
            return res.json({code: 200, message: "success", data: {access_token, refresh_token}});
        } catch (err) {
            log('getAccessToken error: %O', err);
            return responseError(res, err);
        }
    }

    async logout(req: express.Request, res: express.Response) {
        try {
            // remove the refresh token
            // @ts-ignore
            await redisClient.del(req.user.sub);
            // blacklist current access token
            // @ts-ignore
            await redisClient.set('BL_' + req.user.sub, req.token);
            return responseSimple(res);
        } catch (err) {
            log('logout error: %O', err);
            return responseError(res, err);
        }
    }
}

const authController = new AuthController();

export default authController;
