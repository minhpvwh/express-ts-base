import express from 'express';
import usersService from '../../users/services/users.service';
import * as argon2 from 'argon2';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {responseError, responseNotFound, responseUnauthorized} from '../../common/middleware/http.middleware';

class AuthMiddleware {
    async validateBodyRequest(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                errors: ['Missing required fields: email and password'],
            });
        }
    }

    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getUserByEmailWithPassword(
            req.body.email
        );
        if (user) {
            const passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.user = user;
                return next();
            } else {
                return responseUnauthorized(res, 'Password wrong !');
            }
        } else {
            return responseNotFound(res, 'user');
        }
    }

    /**
     * Login using firebase
     * */
    async verifyUserPasswordV2(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const {email, password} = req.body;
        const user: any = await usersService.getUserByEmailWithPassword(
            email
        );
        if (user) {
            const passwordHash = user.password;
            if (await argon2.verify(passwordHash, password)) {
                req.user = user;
                return next();
            } else {
                return responseUnauthorized(res, 'Password wrong !');
            }
        } else {
            return responseNotFound(res, 'user');
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
    }
}

export default new AuthMiddleware();
