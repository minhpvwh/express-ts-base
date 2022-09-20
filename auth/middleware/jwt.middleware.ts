import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import usersService from '../../users/services/users.service';
import {auth} from '../../configs';
import redisClient from "../../common/services/redis.service";
import {responseError, responseUnauthorized} from "../../common/middleware/http.middleware";
import admin from "firebase-admin";

const jwtSecret: string = auth.JWT_SECRET;

class JwtMiddleware {
    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            return next();
        } else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }

    async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getUserByEmailWithPassword(
            res.locals.jwt.email
        );
        const salt = crypto.createSecretKey(
            Buffer.from(res.locals.jwt.refreshKey.data)
        );
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.userId + jwtSecret)
            .digest('base64');
        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user._id,
                email: user.email,
                provider: 'email',
                permissionLevel: user.permissionLevel,
            };
            return next();
        } else {
            return res.status(400).send({ errors: ['Invalid refresh token'] });
        }
    }

    async validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body.refreshToken) {
            try {
                const decoded = jwt.verify(req.body.refreshToken, auth.JWT_REFRESH_SECRET);
                req.user = decoded;

                // @ts-ignore
                const rftRedis = await redisClient.get(decoded.sub.toString());
                if (rftRedis === null) {
                    return res.status(401).json({status: false, message: "Invalid request. Token is not in store."});
                }
                // @ts-ignore
                if(JSON.parse(rftRedis).token !== req.body.refreshToken) {
                    return res.status(401).json({status: false, message: "Invalid request. Token is not same in store."});
                }
                next();
            } catch (err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }

    /**
     * Verify token of request
     * */
    async verifyToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (!req.headers.authorization) {
                return responseUnauthorized(res, 'No token !')
            }
            const token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, auth.JWT_SECRET);
            req.user = decoded;
            // @ts-ignore
            req.token = token;

            // verify blacklisted access token.
            const tokenBL = await redisClient.get(`BL_${decoded.sub}`);
            if (tokenBL && tokenBL === token) {
                return responseUnauthorized(res, 'Blacklisted token !')
            }
            next();
        } catch (error) {
            return responseError(res, error);
        }
    }

    /**
     * Verify token of firebase
     * */
    async verifyTokenV2(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            if (!req.headers.authorization) {
                return responseUnauthorized(res, 'No token !')
            }
            const token = req.headers.authorization.split(' ')[1];

            await admin.auth().verifyIdToken(token)
                .then(async (decodedToken: any) => {
                    const {uid, email, name, firebase} = decodedToken;
                    req.user = {providerUID: uid, email, name, provider: 'provider'};
                    next();
                })
                .catch((error: any) => {
                    // Handle error
                    return responseError(res, error);
                });
        } catch (error) {
            return responseError(res, error);
        }
    }
}

export default new JwtMiddleware();
